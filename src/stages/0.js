import { storage } from "../storage.js";

export const initialStage = {
  exec({ from, client }) {
    storage[from].stage = 1;

    const buttons = [
      {
        buttonText: {
          displayText: "FAZER PEDIDO",
        },
      },
      {
        buttonText: {
          displayText: "FALAR COM ATENDENTE",
        },
      },
    ];

    console.log(buttons);

    client
      .sendButtons(from, "Olá, seja bem-vindo(a)!", buttons, "O que deseja?")
      .then((result) => {
        console.log("Result: ", result); //return object success
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
      });
  },
};
