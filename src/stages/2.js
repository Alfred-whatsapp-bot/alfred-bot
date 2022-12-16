import { storage } from "../storage.js";
import {
  getProdutosByCategory,
  getAllCategorias,
  getProdutoByName,
} from "../../repository/repository.mjs";
import { buttons } from "../helpers/helpers";

export const stageTwo = {
  async exec({ from, message, client }) {
    await getAllCategorias().then(async (data) => {
      const categorias = data.map((item) => {
        storage[from].category = item;
        return item;
      });
      let cat = categorias.map((item) => item.categoria);
      if (cat.includes(message)) {
        await getProdutosByCategory(message).then(async (data) => {
          const itensList = data.map((item, index) => {
            return item;
          });
          let rows = [];
          let list = [
            {
              title: "Itens",
              rows: rows,
            },
          ];
          itensList.map((item, index) => {
            rows.push({
              rowId: `${index + 1}`,
              title: `${item.nome} - R$ ${item.valor}`,
              description: `${item.descricao}`,
            });
          });

          storage[from].categoria = message;
          console.log("Tipo de list qnd é object: " + typeof list);
          await client
            .sendListMenu(
              from,
              `${itensList[0].categoria}`,
              "Escolha um item por vez e monte seu carrinho.",
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
      } else if (message == "FINALIZAR CARRINHO") {
        const itens = storage[from].itens;
        const itensList = itens.map((item, index) => {
          return `*${item.nome}* - R$ ${item.valor}\n`;
        });
        const totalParcial = itens.reduce((total, item) => {
          return Number(total) + Number(item.valor);
        }, 0);
        let msg2 =
          `✏️ *RESUMO DO CARRINHO* \n` +
          `\n${itensList.join("")}` +
          `\nSubtotal: R$ ${totalParcial.toFixed(2)}\n`;
        storage[from].stage = 2;
        await client.sendButtons(
          from,
          msg2,
          buttons(["ADICIONAR MAIS", "REMOVER ITEM", "FINALIZAR PEDIDO"]),
          " "
        );
      } else if (message == "REMOVER ITEM") {
        const itens = storage[from].itens;
        const itensList = itens.map((item, index) => {
          return `${index + 1}.*${item.nome}* - R$ ${item.valor}\n`;
        });
        let msgRemover =
          `✏️ *REMOVER ITEM* \n` +
          `\n${itensList.join("")}` +
          `\nDigite o número do item que deseja remover do carrinho.\n`;
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
          let rows = [];
          let list = [
            {
              title: `${itensList[0].categoria}`,
              rows: rows,
            },
          ];
          itensList.map((item, index) => {
            rows.push({
              rowId: `${index + 1}`,
              title: `${item.nome} - R$ ${item.valor}`,
              description: `${item.descricao}`,
            });
          });

          await client
            .sendListMenu(
              from,
              `${itensList[0].categoria}`,
              "Escolha um item por vez e monte seu carrinho.",
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
      } else if (message == "OUTRA CATEGORIA" || message == "ADICIONAR MAIS") {
        await getAllCategorias().then(async (data) => {
          const categorias = data.map((item) => {
            return item.categoria;
          });

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
          });
          storage[from].stage = 2;
          await client
            .sendListMenu(
              from,
              "Categorias",
              "Escolha um item por vez e monte seu carrinho.",
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
        const msgSplit = message.split("\n", 1)[0];
        const msgSplit2 = msgSplit.substring(0, msgSplit.indexOf(" -"));
        await getProdutoByName(msgSplit2).then(async (data) => {
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
                `\n${itensList.join("")}` +
                `\nSubtotal: R$ ${totalParcial.toFixed(2)}\n`;
              await client
                .sendImage(
                  from,
                  "src/images/24c0a7bc2a7b2570db7555706d0fc107.jpg",
                  "image-name",
                  "```imagem ilustrativa do item```"
                )
                .then((result) => {
                  console.log("Result: ", result); //return object success
                })
                .catch((erro) => {
                  console.error("Error when sending: ", erro); //return object error
                });
              await client.sendButtons(
                from,
                msg2,
                buttons([
                  "OUTRO ITEM",
                  "OUTRA CATEGORIA",
                  "FINALIZAR CARRINHO",
                ]),
                " "
              );
            });
          }
        });
      }
    });
  },
};
