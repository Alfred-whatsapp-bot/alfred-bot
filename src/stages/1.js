import { storage } from "../storage.js";
import { getAllProdutos } from "../../repository/repository.mjs";

export const stageOne = {
  exec({ from, message, client }) {
    if (message == "FALAR COM ATENDENTE") {
      // storage[from].stage = 0;
      // storage[from].itens = [];

      return "🔴 Aguarde enquanto eu conecto você com um atendente. \n\n ```Volte Sempre!```";
    } else {
      getAllProdutos()
        .then((data) => {
          const buttons = [
            {
              buttonText: {
                displayText: "FINALIZAR pedido",
              },
            },
            {
              buttonText: {
                displayText: "CANCELAR pedido",
              },
            },
          ];
          let menu = "";
          data.forEach((item) => {
            let id = item.produto_id;
            menu += `\n*${id}.${item.nome}* - R$ ${item.valor}`;
          });
          storage[from].stage = 2;
          client.sendButtons(
            from,
            menu,
            buttons,
            " ```Digite o código do produto```:"
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
