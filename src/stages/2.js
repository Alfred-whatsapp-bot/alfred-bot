import { storage } from "../storage.js";
import {
  getProdutoById,
  getProdutosByCategory,
} from "../../repository/repository.mjs";

export const stageTwo = {
  exec({ from, message, client }) {
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
    if (message == "CANCELAR pedido") {
      storage[from].stage = 0;
      storage[from].itens = [];

      let msg0 = "🔴 Pedido cancelado com sucesso! \n\n ```Volte Sempre!```";
      client.sendText(from, msg0);
    } else if (message == "FINALIZAR pedido") {
      storage[from].stage = 3;
      let msg = " 🗺️ Agora, informe o *ENDEREÇO COMPLETO*.\n\n ";
      client.sendText(from, msg);
    } else {
      getProdutosByCategory(message)
        .then((data) => {
          const itensList = data.map((item, index) => {
            return `*${item.nome}* - R$ ${item.valor}`;
          });
          const cardapio =
            `📋 *CARDÁPIO* \n\n` +
            itensList.join("\n") +
            "Digite o código do produto para adicionar ao carrinho. \n\n";
          storage[from].stage = 2;
          client.sendText(from, cardapio);

          try {
            getProdutoById(message)
              .then((data) => {
                const produto = data;
                storage[from].itens.push(produto);
                const itens = storage[from].itens;
                const itensList = itens.map((item, index) => {
                  return `*${item.nome}* - R$ ${item.valor}`;
                });
                const valorTotal = itens.reduce((total, item) => {
                  return Number(total) + Number(item.valor);
                }, 0);
                const msg =
                  `🗒️ *RESUMO DO PEDIDO*: \n\n` +
                  itensList.join("\n") +
                  ` \n\n💵 *TOTAL*: *R$ ${Math.ceil(valorTotal).toFixed(2)}*` +
                  ` \n\n📝 *FINALIZAR* ou *CANCELAR* o pedido? \n` +
                  ` Exemplo: \n` +
                  ` FINALIZAR pedido \n\n`;
                client.sendText(from, msg);
              })
              .catch((err) => {
                console.log(err);
              });
          } catch (error) {
            console.log(error);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
