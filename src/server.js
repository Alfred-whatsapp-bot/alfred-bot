import { create } from "venom-bot";
import { stages, getStage } from "./stages.js";

create({
  //session: `session_${Date.now()}`,
  session: "store",
  multidevice: false,
  headless: true,
  executablePath: "/usr/bin/chromium-browser",
  browserArgs: [
    "--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
  ],
})
  .then((client) => start(client))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function start(client) {
  let dateWithouthSecond = new Date();
  dateWithouthSecond.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
  console.log(dateWithouthSecond);
  if (
    dateWithouthSecond.getHours() >= 8 &&
    dateWithouthSecond.getHours() <= 23
  ) {
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
            .catch((error) =>
              console.error("Error when sending message", error)
            );
        }
      } else {
        client.sendText(
          message.from,
          "Desculpe, estamos fechados. Volte amanhã das 8h às 22h."
        );
      }
    });
  }
}
