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
      {
        buttonText: {
          displayText: "OUTRA categoria",
        },
      },
    ];

    getAllCategorias().then((data) => {
      const categorias = data.map((item) => {
        storage[from].category = item;
        return item;
      });
      let cat = categorias.map((item) => item.categoria);
      console.log(cat);
      if (cat.includes(message)) {
        getProdutosByCategory(message).then((data) => {
          const itensList = data.map((item, index) => {
            return `*${item.produto_id}*.${item.nome} - *R$ ${item.valor}*`;
          });
          const cardapio =
            `📋 *CARDÁPIO* \n\n` +
            itensList.join("\n") +
            "\n\nDigite o *código do produto* para adicionar ao *carrinho*.\n" +
            "Apenas *um* por vez. \n\n";
          storage[from].stage = 2;
          client.sendButtons(from, cardapio, buttons, " ");
        });
      } else if (message == "FINALIZAR pedido") {
        storage[from].stage = 3;
        client.sendText(from, "🗺️ Agora, informe o *ENDEREÇO DE ENTREGA*.\n\n");
      } else if (message == "CANCELAR pedido") {
        storage[from].stage = 0;
        client.sendText(from, "```Pedido Cancelado!```");
      } else if (message == "OUTRA categoria") {
        getAllCategorias().then((data) => {
          const categorias = data.map((item) => {
            return item.categoria;
          });

          let botoes = [];
          let array = [];
          let array2 = [];
          let count = 0;
          for (const element of categorias) {
            botoes = {
              buttonText: {
                displayText: element,
              },
            };
            count++;
            if (count < 3) {
              array2.push(botoes);
            } else {
              array.push(botoes);
            }
          }

          console.log(array);
          console.log(array2);

          storage[from].stage = 2;
          client.sendButtons(from, "Escolha uma categoria:", array, " ");
          client.sendButtons(from, "Temos também:", array2, " ");
        });
      } else {
        getProdutoById(message).then((data) => {
          if (data.length > 0) {
            data.map((item) => {
              storage[from].itens.push(item);
              const itens = storage[from].itens;
              const itensList = itens.map((item, index) => {
                return `*${item.nome}* - R$ ${item.valor}\n`;
              });
              const totalParcial = itens.reduce((total, item) => {
                return Number(total) + Number(item.valor);
              }, 0);
              let msg2 =
                `✅ *${item.nome}* adicionado com sucesso! \n` +
                `\nCarrinho: \n${itensList.join("")}` +
                `\nTotal: R$ ${Math.ceil(totalParcial).toFixed(2)}\n` +
                `Digite outra opção:`;
              client.sendButtons(from, msg2, buttons, " ");
            });
          }
        });
      }
    });
  },
};
