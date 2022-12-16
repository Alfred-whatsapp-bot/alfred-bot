import { storage } from "../storage.js";
import { getAllCategorias } from "../../repository/repository.mjs";
import {
  createCliente,
  deleteCliente,
} from "../../repository/clienteRepository.mjs";
import { buttons } from "../helpers/helpers";

export const stageOne = {
  async exec({ from, message, client }) {
    const phone = from.split("@");

    if (message == "FALAR COM ATENDENTE") {
      storage[from].stage = 5;
      storage[from].itens = [];

      const msg =
        "🔴 Aguarde enquanto eu conecto você com um atendente. \n\n ```Volte Sempre!```";

      client.sendText(from, msg); // Teste envio de mensagem para grupo
    } else if (message == "CORRIGIR NOME") {
      await deleteCliente(phone[0]).then(async (data) => {
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
      });
    } else if (message == "FAZER PEDIDO" || message == "AVANÇAR SEM CADASTRO") {
      await getAllCategorias().then(async (data) => {
        const categorias = data.map((item) => {
          return item.categoria;
        });
        console.log("printa categorias: " + categorias);
        let rows = [];
        let list = [
          {
            title: "Categorias",
            rows: rows,
          },
        ];
        categorias.forEach((row, i) => {
          rows.push({
            rowId: `${i + 1}`,
            title: row,
            description: "",
          });
          console.log("printa primeira lista: " + list);
        });

        storage[from].stage = 2;
        await client
          .sendFile(
            from,
            "src/images/CARDAPIO.pdf",
            "CARDAPIO",
            "Veja o cardápio completo aqui."
          )
          .then((result) => {
            console.log("Result: ", result); //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
        console.log("Tipo de list quando é array: " + typeof list);
        await client
          .sendListMenu(
            from,
            "Categorias",
            "Escolha uma e comece seu pedido!",
            "MENU",
            list
          )
          .then((result) => {
            console.log("Result: ", result); //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
      });
    } else {
      storage[from].stage = 1;
      storage[from].cliente = {
        nome: message,
        telefone: phone[0],
      };
      await createCliente(storage[from].cliente).then(async (data) => {
        await client
          .sendButtons(
            from,
            `Olá ${data.nome}, seja bem-vindo(a)!`,
            buttons(["FAZER PEDIDO", "FALAR COM ATENDENTE", "CORRIGIR NOME"]),
            "O que deseja?"
          )
          .then((result) => {
            console.log("Result: ", result); //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
      });
    }
  },
};
