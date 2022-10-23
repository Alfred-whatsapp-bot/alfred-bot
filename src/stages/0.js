import { storage } from "../storage.js";
import { getAllClientes } from "../../repository/clienteRepository.mjs";

export const initialStage = {
  async exec({ from, client }) {
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

    const buttonsDeny = [
      {
        buttonText: {
          displayText: "AVANÇAR SEM CADASTRO",
        },
      },
    ];

    await getAllClientes().then(async (clientes) => {
      const cliente = await clientes.find(
        async (cliente) => cliente.telefone === from
      );
      if (cliente !== null) {
        storage[from].stage = 1;
        await client
          .sendButtons(
            from,
            `Olá ${cliente.nome}, seja bem-vindo(a)!`,
            buttons,
            "O que deseja?"
          )
          .then((result) => {
            console.log("Result: ", result); //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
      } else {
        storage[from].stage = 1;
        await client
          .sendButtons(
            from,
            `Olá, sou o assistente virtual do restaurante! Para começar, poderia me informar seu nome?`,
            buttonsDeny,
            "O que deseja?"
          )
          .then((result) => {
            console.log("Result: ", result); //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
      }
    });
  },
};
