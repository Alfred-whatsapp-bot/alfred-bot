import { storage } from "../storage.js";
import {
  getProdutosByCategory,
  getAllCategorias,
  getProdutoByName,
} from "../../repository/repository.mjs";

export const stageTwo = {
  async exec({ from, message, client }) {
    const buttons = [
      {
        buttonText: {
          displayText: "OUTRO ITEM",
        },
      },
      {
        buttonText: {
          displayText: "OUTRA CATEGORIA",
        },
      },
      {
        buttonText: {
          displayText: "FINALIZAR CARRINHO",
        },
      },
    ];

    const buttons2 = [
      {
        buttonText: {
          displayText: "REMOVER ITEM",
        },
      },
      {
        buttonText: {
          displayText: "ADICIONAR MAIS",
        },
      },
      {
        buttonText: {
          displayText: "FINALIZAR PEDIDO",
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
        await getProdutosByCategory(message).then(async (data) => {
          const itensList = data.map((item, index) => {
            return item;
          });
          let itemList = [];
          let array = [];
          for (const itens of itensList) {
            itemList = {
              title: ` `,
              rows: [
                {
                  title: `${itens.nome}`,
                  description: `R$ ${itens.valor}`,
                },
              ],
            };
            array.push(itemList);
          }

          storage[from].categoria = message;
          await client
            .sendListMenu(
              from,
              `${itensList[0].categoria}`,
              "subTitle",
              "Escolha um item por vez e monte seu carrinho.",
              `CARDÁPIO`,
              array
            )
            .then((result) => {
              console.log("Result: ", result); //return object success
            })
            .catch((erro) => {
              console.error("Error when sending: ", erro); //return object error
            });
        });
      } else if (message == "FINALIZAR CARRINHO") {
        const itens = storage[from].itens;
        const itensList = itens.map((item, index) => {
          return `*${item.nome}* - R$ ${item.valor}\n`;
        });
        const totalParcial = itens.reduce((total, item) => {
          return Number(total) + Number(item.valor);
        }, 0);
        let msg2 =
          `✏️ *RESUMO DO PEDIDO* \n` +
          `\n${itensList.join("")}` +
          `\nSubtotal: R$ ${totalParcial.toFixed(2)}\n`;
        storage[from].stage = 2;
        await client.sendButtons(from, msg2, buttons2, " ");
      } else if (message == "REMOVER ITEM") {
        const itens = storage[from].itens;
        const itensList = itens.map((item, index) => {
          return `${index}-*${item.nome}* - R$ ${item.valor}\n`;
        });
        let msgRemover =
          `✏️ *REMOVER ITEM* \n` +
          `\n${itensList.join("")}` +
          `\n\nDigite o número do item que deseja remover do carrinho.\n`;
        storage[from].stage = 6;
        await client.sendText(from, msgRemover);
      } else if (message == "FINALIZAR PEDIDO") {
        storage[from].stage = 3;
        await client.sendText(
          from,
          "🗺️ Agora, informe o *ENDEREÇO DE ENTREGA*.\n\n"
        );
      } else if (message == "OUTRO ITEM") {
        const categoria = storage[from].categoria;
        await getProdutosByCategory(categoria).then(async (data) => {
          const itensList = data.map((item, index) => {
            return item;
          });
          let itemList = [];
          let array = [];
          for (const itens of itensList) {
            itemList = {
              title: ` `,
              rows: [
                {
                  title: `${itens.nome}`,
                  description: `R$ ${itens.valor}`,
                },
              ],
            };
            array.push(itemList);
          }          
          //storage[from].categoria = message;
          await client
            .sendListMenu(
              from,
              `${itensList[0].categoria}`,
              "subTitle",
              "Escolha um item por vez e monte seu carrinho.",
              `CARDÁPIO`,
              array
            )
            .then((result) => {
              console.log("Result: ", result); //return object success
            })
            .catch((erro) => {
              console.error("Error when sending: ", erro); //return object error
            });
        });
      } else if (message == "OUTRA CATEGORIA" || message == "ADICIONAR MAIS") {
        await getAllCategorias().then(async (data) => {
          const categorias = data.map((item) => {
            return item.categoria;
          });
          console.log(categorias);
          let categoriaList = [];
          let array = [];
          for (const categoria of categorias) {
            categoriaList = {
              title: ` `,
              rows: [
                {
                  title: `${categoria}`,
                  description: "",
                },
              ],
            };
            array.push(categoriaList);
          }
          console.log(array);
          storage[from].stage = 2;
          await client
            .sendListMenu(
              from,
              "Categorias",
              "subTitle",
              "Escolha um item por vez e monte seu carrinho.",
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
                `✅ *${item.nome}* adicionado ao *CARRINHO*! \n` +
                `\nCarrinho: \n${itensList.join("")}` +
                `\nSubtotal: R$ ${totalParcial.toFixed(2)}\n`;
              await client.sendButtons(from, msg2, buttons, " ");
            });
          }
        });
      }
    });
  },
};
