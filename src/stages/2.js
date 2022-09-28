import { storage } from "../storage.js";
import { getProdutoById, getProdutosByCategory } from "../../repository/repository.mjs";

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
          } else {
            client.sendText(
              from,
              "❌ *Código inválido* \n\n" +
                "```Digite novamente```: \n\n" +
                order
            );
          }
        })
        .catch((error) => console.error("Error when sending message", error));
    }
  },
};
