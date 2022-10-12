import { storage } from "../storage.js";

export const removalStage = {
  async exec({ from, message, client }) {
    const buttons = [
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
    await storage[from].itens.splice(message, 1);

    const newItemList = storage[from].itens.map((item, index) => {
      return `*${item.nome}* - *R$ ${item.valor}*\n`;
    });

    const valorTotal = newItemList.reduce((total, item) => {
      return Number(total) + Number(item.valor);
    }, 0);

    const msg =
      `Item removido com sucesso!` +
      `\n\n*CARRINHO:*` +
      `\n${newItemList.join("")}` +
      `\n\n*TOTAL:* *R$ ${valorTotal}*`;
    storage[from].stage = 2;
    await client.sendButtons(from, msg, buttons, "O que deseja fazer agora?");
  },
};
