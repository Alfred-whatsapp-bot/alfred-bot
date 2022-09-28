import { storage } from "../storage.js";
import {
  getProdutoById,
  getProdutosByCategory,
  getAllCategorias,
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
    const categoria = getAllCategorias().then((data) => {
      data.map((item) => {
        return item.categoria;
      });
    });

    if (message == "CANCELAR pedido") {
      storage[from].stage = 0;
      storage[from].itens = [];

      let msg0 = "🔴 Pedido cancelado com sucesso! \n\n ```Volte Sempre!```";
      client.sendText(from, msg0);
    } else if (message == "FINALIZAR pedido") {
      storage[from].stage = 3;
      let msg = " 🗺️ Agora, informe o *ENDEREÇO COMPLETO*.\n\n ";
      client.sendText(from, msg);
    } else if (message.includes(categoria)) {
      getProdutosByCategory(message).then((data) => {
        const itensList = data.map((item, index) => {
          return `*${item.produto_id}.*${item.nome}* - R$ ${item.valor}`;
        });
        const cardapio =
          `📋 *CARDÁPIO* \n\n` +
          itensList.join("\n") +
          "\n\nDigite o código do produto para adicionar ao carrinho. \n\n" +
          "Apenas um por vez. \n\n";
        storage[from].stage = 2;
        client.sendText(from, cardapio);
      });
    } else {
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
            `🗒️ *CARRINHO*: \n\n` +
            itensList.join("\n") +
            ` \n\n💵 *TOTAL*: *R$ ${Math.ceil(valorTotal).toFixed(2)}*`;

          client.sendButtons(from, msg, buttons, " ");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
