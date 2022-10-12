import { storage } from "../storage.js";
import { getDistancia } from "../../repository/repository.mjs";

export const stageThree = {
  async exec({ from, message, client }) {
    storage[from].address = message;
    await getDistancia(message)
      .then(async (data) => {
        console.log(data);
        const distancia = 10;
        //const distancia = data.distancia ? data.distancia : 10;
        const order = "🗒️ *RESUMO DO PEDIDO*: \n\n";
        const itens = storage[from].itens;
        const itensList = itens.map((item, index) => {
          return `*${item.nome}* - R$ ${item.valor}`;
        });

        const valorTotal = itens.reduce((total, item) => {
          return Number(total) + Number(item.valor);
        }, 0);

        const taxaEntrega = (distancia * 1.5).toFixed(2);
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
          ` \n\n📝 Qual a *FORMA DE PAGAMENTO*? \n` +
          ` Exemplo: \n` +
          ` Dinheiro, troco para R$20.00 \n\n`;
        await client.sendText(from, msg);
        storage[from].stage = 4;
      })
      .catch((err) => {
        console.log(err);
      }, 0);
  },
};
