import {
  getAllCategorias,
  getAllProdutos,
} from "../../repository/repository.mjs";
import { storage } from "../storage.js";

export const initialStage = {
  async exec({ from, client }) {
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

    await client
      .sendButtons(from, "Olá, seja bem-vindo(a)!", buttons, "O que deseja?")
      .then((result) => {
        console.log("Result: ", result); //return object success
      })
      .catch((erro) => {
        console.error("Error when sending: ", erro); //return object error
      });
  },
};
