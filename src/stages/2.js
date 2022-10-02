import { storage } from "../storage.js";
import {
  getProdutoById,
  getProdutosByCategory,
  getAllCategorias,
  getProdutoByName,
} from "../../repository/repository.mjs";

export const stageTwo = {
  async exec({ from, message, client }) {
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

    await getAllCategorias().then(async (data) => {
      const categorias = data.map((item) => {
        storage[from].category = item;
        return item;
      });
      let cat = categorias.map((item) => item.categoria);
      console.log(cat);
      if (cat.includes(message)) {
        // await getProdutosByCategory(message).then(async (data) => {
        //   const itensList = data.map((item, index) => {
        //     return `*${item.produto_id}*.${item.nome} - *R$ ${item.valor}*`;
        //   });
        // const cardapio =
        //   `📋 *CARDÁPIO* \n\n` +
        //   itensList.join("\n") +
        //   "\n\nDigite o *código do produto* para adicionar ao *carrinho*.\n" +
        //   "Apenas *um* por vez. \n\n";
        // storage[from].stage = 2;
        // await client.sendButtons(from, cardapio, buttons, " ");
        //});
        await getProdutosByCategory(message).then(async (data) => {
          const itensList = data.map((item, index) => {
            return item;
          });
          let itemList = [];
          let array = [];
          for (const itens of itensList) {
            (itemList = {
              title: ` `,
              rows: [
                {
                  title: `${itens.nome}`,
                  description: `R$ ${itens.valor}`,
                },
              ],
            }),
              array.push(itemList);
          }
          console.log(array);
          await client
            .sendListMenu(
              from,
              "Cardápio",
              "subTitle",
              "Escolha um prato por vez.",
              "CARDÁPIO",
              array
            )
            .then((result) => {
              console.log("Result: ", result); //return object success
            })
            .catch((erro) => {
              console.error("Error when sending: ", erro); //return object error
            });
        });
      } else if (message == "FINALIZAR pedido") {
        storage[from].stage = 3;
        await client.sendText(
          from,
          "🗺️ Agora, informe o *ENDEREÇO DE ENTREGA*.\n\n"
        );
      } else if (message == "CANCELAR pedido") {
        storage[from].stage = 0;
        await client.sendText(from, "```Pedido Cancelado!```");
      } else if (message == "OUTRA categoria") {
        await getAllCategorias().then(async (data) => {
          const categorias = data.map((item) => {
            return item.categoria;
          });
          console.log(categorias);
          let categoriaList = [];
          let array = [];
          for (const categoria of categorias) {
            (categoriaList = {
              title: ` `,
              rows: [
                {
                  title: `${categoria}`,
                  description: "",
                },
              ],
            }),
              array.push(categoriaList);
          }
          console.log(array);
          storage[from].stage = 2;
          await client
            .sendListMenu(
              from,
              "Categorias",
              "subTitle",
              "Escolha uma categoria:",
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
        const msg = message.split("\n", 1)[0];
        await getProdutoByName(msg).then(async (data) => {
          if (data.length > 0) {
            data.map(async (item) => {
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
                `\nSubtotal: R$ ${Math.ceil(totalParcial).toFixed(2)}\n`;
              await client.sendButtons(from, msg2, buttons, " ");
            });
          }
        });
      }
    });
  },
};
