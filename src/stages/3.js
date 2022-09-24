import { storage } from "../storage.js";
import fetch from "node-fetch";

export const stageThree = {
  async exec({ from, message, client }) {
    fetch(
      "https://chatbot-location-api.herokuapp.com/location?address=" + message
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    const order = "🗒️ *RESUMO DO PEDIDO*: \n\n";
    const itens = storage[from].itens;
    const itensList = itens.map((item) => {
      return `*${item.description}* - *R$ ${item.price.toFixed(2)}*`;
    });
    const total = itens.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
    const totalFormatted = total.toFixed(2).toString().replace(".", ",") + "0";
    const msg =
      order +
      itensList.join("\n") +
      ` \n📍 Endereço: *${message}*` +
      `\n*TOTAL* - *R$ ${totalFormatted}* + *R$* de taxa de entrega.` +
      `\n\n📝 Agora, informe a *FORMA DE PAGAMENTO* e se vai precisar de troco. \n\n` +
      `*Exemplo:* \n\n` +
      `*Dinheiro* \n` +
      `*Troco para R$ 20,00* \n\n`;
    await client.sendText(from, msg);
    storage[from].stage = 4;
    return "✅ *Prontinho, pedido feito!* \n\nAgora, se você ainda não sabe o valor da taxa de entrega para sua região, vou te passar para um atendente para que ele verique o valor da *taxa de entrega*. \n\n⏳ *Aguarde um instante*.";
  },
};
