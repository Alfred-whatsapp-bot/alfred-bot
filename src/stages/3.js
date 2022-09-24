import { storage } from "../storage.js";
import fetch from "node-fetch";

export const stageThree = {
  async exec({ from, message, client }) {
    storage[from].address = message;
    fetch("https://chatbot-location-api.herokuapp.com/location?address=" + message)
      .then((response) => response.json())
      .then((data) => {
        console.log("Distância: " + data);
        const order = "🗒️ *RESUMO DO PEDIDO*: \n\n";
        const itens = storage[from].itens;
        const itensList = itens.map((item) => {
          return `🍽️ ${item.description} - *R$${item.price.toFixed(2)}*`;
        });
        const total = itens.reduce((acc, item) => {
          return acc + item.price;
        }, 0);
        const totalFormatted = (total + data).toFixed(2);
        const msg =
          order +
          itensList.join("\n") +
          ` \n📍 Endereço: *${message}*` +
          ` \n🚚 Taxa de entrega: *R$ ${Math.ceil(data.toFixed(2))}*` +
          ` \n💵 *TOTAL*: *R$ ${Math.ceil(totalFormatted)}*` +
          ` \n\n📝 Agora, informe a *FORMA DE PAGAMENTO*. \n` +
          ` *Exemplo:* \n` +
          ` *Dinheiro, troco* para R$ 20,00 \n\n`;
        client.sendText(from, msg);
        storage[from].stage = 4;
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        console.log("Finished");
        storage[from].stage = 4;
        return "✅ *Prontinho, pedido feito!* \n\nAgora, se você ainda não sabe o valor da taxa de entrega para sua região, vou te passar para um atendente para que ele verique o valor da *taxa de entrega*. \n\n⏳ *Aguarde um instante*.";
      });
  },
};
