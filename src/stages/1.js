import { storage } from "../storage.js";
import {
  getAllCategorias,
  getAllProdutos,
} from "../../repository/repository.mjs";

export const stageOne = {
  exec({ from, message, client }) {
    if (message == "FALAR COM ATENDENTE") {
      storage[from].stage = 5;
      storage[from].itens = [];

      return "🔴 Aguarde enquanto eu conecto você com um atendente. \n\n ```Volte Sempre!```";
    } else {
      // getAllProdutos()
      //   .then((data) => {
      //     const buttons = [
      //       {
      //         buttonText: {
      //           displayText: "FINALIZAR pedido",
      //         },
      //       },
      //       {
      //         buttonText: {
      //           displayText: "CANCELAR pedido",
      //         },
      //       },
      //     ];
      //     let menu = "";
      //     data.forEach((item) => {
      //       let id = item.produto_id;
      //       menu += `\n*${id}.${item.nome}* - R$ ${item.valor}`;
      //     });
      //     storage[from].stage = 2;
      //     client.sendButtons(
      //       from,
      //       menu,
      //       buttons,
      //       "Digite o código do produto:"
      //     );
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });

      getAllCategorias()
        .then((data) => {
          const categorias = data.map((item) => {
            return item.categoria;
          });

          let botoes = [];
          let array = [];
          for (const element of categorias) {
            botoes = {
              buttonText: {
                displayText: element,
              },
            };
            array.push(botoes);
          }

          console.log(array);

          storage[from].stage = 2;
          client.sendButtons(
            from,
            "Escolha uma categoria:",
            array,
            "Digite o código do produto:"
          );
        })
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }
  },
};
