import { create } from "venom-bot";
import { stages, getStage } from "./stages.js";

create({
  session: "store",
  multidevice: true,
  headless: false,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  // ignoreHTTPSErrors: true,
  // puppeteerOptions: {
  //   executablePath: "/usr/bin/chromium-browser",
  // },
})
  .then((client) => start(client))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function start(client) {
  client.onMessage((message) => {
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
          .catch((error) => console.error("Error when sending message", error));
      }

      if (currentStage == 5) {
        stages[currentStage].stage.exec({
          from: message.from,
          message: message.body,
          client,
        });
      }
    }
  });
}
