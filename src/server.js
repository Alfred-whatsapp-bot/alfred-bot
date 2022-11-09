import venom from "../node_modules/venom-bot";
import { stages, getStage } from "./stages.js";
import { createRequire } from "module";
import { chatbotOptions, venomOptions } from "./config";
import express from "express";
import fs from "fs";
import http from "http";
import { exec } from "child_process";
//import mime from "mime-types";
const require = createRequire(import.meta.url);
require("dotenv").config();
import bodyParser from "body-parser";
//import { getUserByEmail, createUser } from "../repository/userRepository.mjs";
import { Users } from "../model/user.model.cjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";
import cors from "cors";

/**
 * Logging debug
 * @param {String} type
 * @param {String} message
 */
export function log(type, message) {
  const datetime = new Date().toLocaleString();
  const msg = `[${datetime}] [${type}] ${message.replace(/\n/g, " ")}`;
  console.log(msg);
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs", { recursive: true });
    fs.writeFileSync("logs/conversations.log", "");
  }
  fs.appendFileSync("logs/conversations.log", msg + "\n", "utf8");
}

/**
 * Logging error
 * @param {String} message
 */
export function error(message, err) {
  const datetime = new Date().toLocaleString();
  const msg = `[${datetime}] [Error] ${message.replace(/\n/g, " ")}`;
  console.error(msg);
  console.error(err);
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs", { recursive: true });
    fs.writeFileSync("logs/conversations.log", "");
  }
  fs.appendFileSync(
    "logs/conversations.log",
    msg + " " + err.status + "\n",
    "utf8"
  );
}

/**
 * Create a chatbot http Qr login
 * @param {String} name
 * @param {Number} port
 */
export async function httpCtrl(name, port = 4000) {
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs", { recursive: true });
    fs.writeFileSync("logs/conversations.log", "");
  }
  const app = express();
  //app.use(bodyParser.json()); // support json encoded bodies
  app.use(cors()); // support cors
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(
      `\x1b[32minfo\x1b[39m:     [${name}] Http chatbot control running on http://localhost:${port}/`
    );
  });
  const authorize = (req, res) => {
    const reject = () => {
      res.setHeader("www-authenticate", "Basic");
      res.sendStatus(401);
    };
    const authorization = req.headers.authorization;
    if (!authorization) {
      return reject();
    }
    const [username, password] = Buffer.from(
      authorization.replace("Basic ", ""),
      "base64"
    )
      .toString()
      .split(":");

    if (
      !(
        username === chatbotOptions.httpCtrl.username &&
        password === chatbotOptions.httpCtrl.password
      )
    ) {
      return reject();
    }
  };
  app.get("/", (req, res, next) => {
    authorize(req, res);
    const buffer = fs.readFileSync("src/httpCtrl.html");
    let html = buffer.toString();
    res.send(html);
  });
  app.get("/data", (req, res, next) => {
    //authorize(req, res);

    const infoPath = `tokens/${name}/info.json`;
    const qrPath = `tokens/${name}/qr.json`;
    const sessPath = `tokens/${name}/session.json`;
    const info = fs.existsSync(infoPath)
      ? JSON.parse(fs.readFileSync(infoPath))
      : null;
    const qr = fs.existsSync(qrPath)
      ? JSON.parse(fs.readFileSync(qrPath))
      : null;
    const sess = fs.existsSync(sessPath)
      ? JSON.parse(fs.readFileSync(sessPath))
      : null;
    const logs = fs
      .readFileSync("logs/conversations.log")
      .toString()
      .replace(/\n/g, "<br>");
    res.json({
      info,
      session: sess,
      qr: qr,
      logs: logs,
    });
  });
  app.get("/connection", async (req, res, next) => {
    authorize(req, res);
    const connectionPath = `tokens/${name}/connection.json`;
    const connection = fs.existsSync(connectionPath)
      ? JSON.parse(fs.readFileSync(connectionPath))
      : null;
    res.json({ status: connection?.status });
  });
  app.get("/controls/start", (req, res, next) => {
    authorize(req, res);
    exec("yarn start", (err, stdout, stderr) => {
      if (err) {
        res.json({ status: "ERROR" });
        console.error(err);
        return;
      }
      res.json({ status: "OK" });
      console.log(stdout);
      log("Start", `Start chatbot...`);
    });
  });
  app.get("/controls/stop", (req, res, next) => {
    authorize(req, res);
    exec("yarn stop", (err, stdout, stderr) => {
      if (err) {
        res.json({ status: "ERROR" });
        console.error(err);
        return;
      }
      res.json({ status: "OK" });
      console.log(stdout);
      log("Stop", `Stop chatbot...`);
    });
  });
  app.get("/controls/reload", (req, res, next) => {
    authorize(req, res);
    exec("yarn reload", (err, stdout, stderr) => {
      if (err) {
        res.json({ status: "ERROR" });
        console.error(err);
        return;
      }
      res.json({ status: "OK" });
      console.log(stdout);
      log("Reload", `Reloading chatbot...`);
    });
  });
  app.get("/controls/restart", (req, res, next) => {
    authorize(req, res);
    exec("yarn restart", (err, stdout, stderr) => {
      if (err) {
        res.json({ status: "ERROR" });
        console.error(err);
        return;
      }
      res.json({ status: "OK" });
      console.log(stdout);
      log("Restart", `Restart chatbot...`);
    });
  });
  app.post("/register", async (req, res) => {
    // Our register logic starts here
    try {
      const { nome, email, senha } = req.body;

      // Validate user input
      if (!(email && nome && senha)) {
        res.status(400).send("All input is required");
      }

      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await Users.findOne({ where: { email: email } });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }

      //Encrypt user password
      const encryptedPassword = await bcrypt.hash(senha, 10);

      // Create user in our database
      const user = await Users.create({
        nome,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        senha: encryptedPassword,
      });

      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;

      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  app.post("/login", async (req, res) => {
    let authorized = false;
    // Our login logic starts here
    try {
      // Get user input
      const { email, senha } = req.body;

      // Validate user input
      if (!(email && senha)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await Users.findOne({ where: { email: email } });

      if (user && (await bcrypt.compare(senha, user.senha))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );

        // save user token
        user.token = token;

        // user
        res.status(200).json(user);
        authorized = true;
        return authorized;
      } else {
        res.status(400).json("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
    }
  });
  app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
  });
}

/**
 * Create a chatbot session
 * @param {String} name
 * @param {Array} conversation
 */
export async function session(name, conversation) {
  log("Init", "Starting chatbot...");
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(`tokens/${name}`)) {
      fs.mkdirSync(`tokens/${name}`, { recursive: true });
    }
    fs.writeFileSync(
      `tokens/${name}/qr.json`,
      JSON.stringify({ attempts: 0, base64Qr: "" })
    );
    fs.writeFileSync(
      `tokens/${name}/session.json`,
      JSON.stringify({ session: name, status: "starting" })
    );
    fs.writeFileSync(
      `tokens/${name}/info.json`,
      JSON.stringify({
        id: "",
        formattedTitle: "",
        displayName: "",
        isBusiness: "",
        imgUrl: "",
        wWebVersion: "",
        groups: [],
      })
    );
    venom
      .create(
        name,
        (base64Qr, asciiQR, attempts, urlCode) => {
          fs.writeFileSync(
            `tokens/${name}/qr.json`,
            JSON.stringify({ attempts, base64Qr })
          );
        },
        (statusSession, session) => {
          fs.writeFileSync(
            `tokens/${name}/session.json`,
            JSON.stringify({ session: name, status: statusSession })
          );
        },
        venomOptions
      )
      .then(async (client) => {
        await start(client, conversation);
        const hostDevice = await client.getHostDevice();
        const wWebVersion = await client.getWAVersion();
        const groups = (await client.getAllChats())
          .filter((chat) => chat.isGroup)
          .map((group) => {
            return { id: group.id._serialized, name: group.name };
          });
        setInterval(async () => {
          let status = "DISCONNECTED";
          try {
            status = await client.getConnectionState();
          } catch (error) {}
          fs.writeFileSync(
            `tokens/${name}/connection.json`,
            JSON.stringify({ status })
          );
          fs.writeFileSync(
            `tokens/${name}/info.json`,
            JSON.stringify({
              id: hostDevice.id._serialized,
              formattedTitle: hostDevice.formattedTitle,
              displayName: hostDevice.displayName,
              isBusiness: hostDevice.isBusiness,
              imgUrl: hostDevice.imgUrl,
              wWebVersion,
              groups,
            })
          );
        }, 2000);
        resolve(client);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });

  async function start(client, conversation) {
    log(
      "Start",
      `Conversation flow (${conversation.length} replies) running...`
    );
    client.onMessage((message) => {
      console.log(message);
      if (!message.isGroupMsg) {
        const currentStage = getStage({ from: message.from });

        const messageResponse = stages[currentStage].stage.exec({
          from: message.from,
          message: message.body,
          client,
        });

        if (messageResponse) {
          client
            .sendText(message.from, messageResponse)
            .then(() => {
              console.log("Message sent.");
            })
            .catch((error) =>
              console.error("Error when sending message", error)
            );
        }
      } else {
        client
          .sendText(message.from, "🔴 Desculpe, não atendemos grupos!")
          .then(() => {
            console.log("Message sent.");
          })
          .catch((error) => console.error("Error when sending message", error));
      }
    });
  }
}
