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

    // Send List menu
    //This function does not work for Bussines contacts
    await getAllProdutos().then(async (data) => {
      const list = data.map((item) => {
        return {
          id: item.produto_id,
          nome: item.nome,
          categoria: item.categoria,
          valor: item.valor,
        };
      });

      let listMenu = [];
      for (const element of list) {
        listMenu = [
          {
            title: element.categoria,
            rows: [
              {
                title: element.nome,
                description: element.valor,
              },
            ],
          },
        ];
      }
      console.log(listMenu);

      await client
        .sendListMenu(
          from,
          "Title",
          "subTitle",
          "Description",
          "menu",
          listMenu
        )
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    });
  },
};
