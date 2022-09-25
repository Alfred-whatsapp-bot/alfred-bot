import { storage } from "../storage.js";
import { getDistancia } from "../../repository/repository.mjs";

export const stageThree = {
  async exec({ from, message, client }) {
    storage[from].address = message;
    getDistancia(message)
      .then((data) => {
        console.log("Distância: " + data.distancia + " Status: ", data.status);
        const distancia = data.status == "200" ? data.distancia : 7;
        const order = "🗒️ *RESUMO DO PEDIDO*: \n\n";
        const itens = storage[from].itens;
        const itensList = itens.map((item, index) => {
          return `*${item.nome}* - R$ ${item.valor}`;
        });

        const valorTotal = itens.reduce((total, item) => {
          return Number(total) + Number(item.valor);
        }, 0);
        const taxaEntrega = (distancia * 1.5).toFixed(2);
        const totalFinal = taxaEntrega + valorTotal;
        const msg =
          order +
          itensList.join("\n") +
          ` \n📍 Endereço: *${message}*` +
          ` \n🚚 Taxa de entrega: *R$ ${Math.ceil(taxaEntrega)}*` +
          ` \n💵 *TOTAL*: *R$ ${totalFinal}*` +
          ` \n\n📝 Agora, informe a *FORMA DE PAGAMENTO*. \n` +
          ` *Exemplo:* \n` +
          ` *Dinheiro, troco* para R$ 20,00 \n\n`;
        client.sendText(from, msg);
        storage[from].stage = 4;
      })
      .catch((err) => {
        console.log(err);
      }, 0);
  },
};
