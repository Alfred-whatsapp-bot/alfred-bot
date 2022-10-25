import { storage } from "../storage.js";
import { getAllCategorias } from "../../repository/repository.mjs";
import { createCliente } from "../../repository/clienteRepository.mjs";

export const stageOne = {
  async exec({ from, message, client }) {
    const phone = from.split("@");
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
    if (message == "FALAR COM ATENDENTE") {
      storage[from].stage = 5;
      storage[from].itens = [];

      const msg =
        "🔴 Aguarde enquanto eu conecto você com um atendente. \n\n ```Volte Sempre!```";

      client.sendText(from, msg); // Teste envio de mensagem para grupo
    } else if (message == "FAZER PEDIDO" || message == "AVANÇAR SEM CADASTRO") {
      await getAllCategorias().then(async (data) => {
        const categorias = data.map((item) => {
          return item.categoria;
        });
        console.log(categorias);
        let categoriaList = [];
        let array = [];
        for (const categoria of categorias) {
          (categoriaList = {
            title: " ",
            rows: [
              {
                title: `${categoria}`,
                description: "",
              },
            ],
          }),
            array.push(categoriaList);
        }
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
        await client
          .sendListMenu(
            from,
            "Categorias",
            "Subtitulo",
            "Escolha uma e comece seu pedido.",
            "MENU",
            array
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
            buttons,
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
