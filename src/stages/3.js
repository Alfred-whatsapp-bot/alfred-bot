import { storage } from "../storage.js";
import { getDistancia } from "../../repository/repository.mjs";

export const stageThree = {
  async exec({ from, message, client }) {
    const buttons = [
      {
        buttonText: {
          displayText: "CARTÃO",
        },
      },
      {
        buttonText: {
          displayText: "DINHEIRO",
        },
      },
      {
        buttonText: {
          displayText: "OUTRO",
        },
      },
    ];
    storage[from].address = message;
    await getDistancia(message)
      .then(async (data) => {
        console.log(data);
        const distancia = 10;
        //const distancia = typeof data == Number ? data : 10;
        const order = "🗒️ *RESUMO DO PEDIDO*: \n\n";
        const itens = storage[from].itens;
        const itensList = itens.map((item, index) => {
          return `*${item.nome}* - R$ ${item.valor}`;
        });

        const valorTotal = itens.reduce((total, item) => {
          return Number(total) + Number(item.valor);
        }, 0);

        const taxaEntrega = Number((distancia * 1.5).toFixed(2));
        const totalFinal = (Number(taxaEntrega) + Number(valorTotal)).toFixed(
          2
        );

        storage[from].total = totalFinal;

        const msg =
          order +
          itensList.join("\n") +
          ` \n\n📍 Endereço: *${message}*` +
          ` \n🚚 Taxa de entrega: *R$ ${Math.ceil(taxaEntrega).toFixed(2)}*` +
          ` \n\n💵 *TOTAL*: *R$ ${Number(totalFinal).toFixed(2)}*` +
          ` \n\n📝 Qual a *FORMA DE PAGAMENTO*? \n`;
        await client.sendButtons(from, msg, buttons, " ");

        storage[from].stage = 4;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
