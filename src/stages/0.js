import { storage } from "../storage.js";
import {
  deleteCliente,
  getClienteByPhoneNumber,
} from "../../repository/clienteRepository.mjs";
import { buttons } from "../helpers";

export const initialStage = {
  async exec({ from, client }) {
    await deleteCliente(`556593291981`);
    await client.startTyping(from);
    const phone = from.split("@");

    // const buttons = [
    //   {
    //     buttonText: {
    //       displayText: "FAZER PEDIDO",
    //     },
    //   },
    //   {
    //     buttonText: {
    //       displayText: "FALAR COM ATENDENTE",
    //     },
    //   },
    //   {
    //     buttonText: {
    //       displayText: "CORRIGIR NOME",
    //     },
    //   },
    // ];

    // const buttonsDeny = [
    //   {
    //     buttonText: {
    //       displayText: "AVANÇAR SEM CADASTRO",
    //     },
    //   },
    // ];

    await getClienteByPhoneNumber(phone[0]).then(async (clientes) => {
      const cliente = await clientes.find(
        async (cliente) => cliente.telefone === from
      );
      if (cliente !== undefined) {
        storage[from].stage = 1;
        await client
          .sendButtons(
            from,
            `Olá ${cliente.nome}, seja bem-vindo(a)!`,
            buttons(["FAZER PEDIDO", "FALAR COM ATENDENTE", "CORRIGIR NOME"]),
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
            `Olá, sou o assistente virtual do restaurante!\nPara começar, poderia me informar seu nome?`,
            buttons(["AVANÇAR SEM CADASTRO"]),
            "Me lembrarei nos próximos pedidos!"
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
