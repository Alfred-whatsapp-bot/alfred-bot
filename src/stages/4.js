import { storage } from "../storage.js";

export const stageFour = {
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
        const totalFinal = (Number(taxaEntrega) + Number(valorTotal)).toFixed(
          2
        );

        storage[from].total = totalFinal;

        const msg =
          order +
          itensList.join("\n") +
          ` \n\n📍 Endereço: *${message}*` +
          ` \n🚚 Taxa de entrega: *R$ ${Math.ceil(taxaEntrega).toFixed(2)}*` +
          ` \n\n💵 *TOTAL*: *R$ ${Math.ceil(totalFinal).toFixed(2)}*` +
          ` \n\n📝 Qual a *FORMA DE PAGAMENTO*? \n` +
          ` Exemplo: \n` +
          ` Dinheiro, troco para R$20.00 \n\n`;
        client.sendText(from, msg);
        storage[from].stage = 4;
      })
      .catch((err) => {
        console.log(err);
      }, 0);
  },
};
