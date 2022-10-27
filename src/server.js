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
 * Create a chatbot session
 * @param {String} name
 * @param {Array} conversation
 */
export async function session(name, conversation) {
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
    .then((client) => start(client))
    .catch((err) => console.error(err));
}

/**
 * Create a chatbot http Qr login
 * @param {String} name
 * @param {Number} port
 */
const port = process.env.PORT || 5000;
export async function httpCtrl(name, port) {
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs", { recursive: true });
    fs.writeFileSync("logs/conversations.log", "");
  }
  const app = express();
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
    authorize(req, res);
    const qrPath = `tokens/${name}/qr.json`;
    const sessPath = `tokens/${name}/session.json`;
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
      session: sess,
      qr: qr,
      logs: logs,
    });
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
    });
  });
}

function start(client) {
  let date = new Date();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let hourMinutes = hour + ":" + minutes;
  console.log(hourMinutes);
  client.onMessage((message) => {
    if (hour >= 8 && hour <= 22) {
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
    } else {
      client.sendText(
        message.from,
        "Desculpe, estamos fechados. Volte amanhã das 8h às 22h."
      );
    }
  });
}
