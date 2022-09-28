import { create } from "venom-bot";
import { stages, getStage } from "./stages.js";

create({
  //session: `session_${Date.now()}`,
  session: "store",
  multidevice: false,
  headless: true,
  executablePath: "/usr/bin/chromium-browser",
})
  .then((client) => start(client))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

function start(client) {
  client.onMessage((message) => {
    let dateWithouthSecond = new Date();
    dateWithouthSecond.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (
      dateWithouthSecond.getHours() >= 8 &&
      dateWithouthSecond.getHours() <= 23
    ) {
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

        // if (currentStage == 5) {
        //   stages[currentStage].stage.exec({
        //     from: message.from,
        //     message: message.body,
        //     client,
        //   });
        // }
      }
    } else {
      client.sendText(
        message.from,
        "Desculpe, estamos fechados. Volte amanhã das 8h às 22h."
      );
    }
  });
}
