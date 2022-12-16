import { storage } from "../storage.js";
import {
  deleteCliente,
  getClienteByPhoneNumber,
} from "../../repository/clienteRepository.mjs";
import { buttons } from "../helpers/helpers";
import { sendEmail } from "../helpers/helpers";

export const initialStage = {
  async exec({ from, client }) {
    //await deleteCliente(`556593291981`);
    const phone = from.split("@");

    await getClienteByPhoneNumber(phone[0]).then(async (clientes) => {
      const cliente = await clientes.find(
        async (cliente) => cliente.telefone === from
      );

      // let emailMessage = `<h1>Teste de envio de e-mail</h1><br /><p>Nome: ${cliente.nome}</p><br /><p>Telefone: ${phone[0]}</p>`;
      // let options = {
      //   subject: "Teste de envio de e-mail",
      //   message: emailMessage,
      // };
      // sendEmail(options);
      if (cliente !== undefined) {
        storage[from].stage = 1;
        await client
          .sendButtons(
            from,
            `Olá ${cliente.nome}, seja bem-vindo(a)!`,
            buttons(["FAZER PEDIDO", "FALAR COM ATENDENTE", "CORRIGIR NOME"]),
            //botoes,
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
            //botoes,
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
