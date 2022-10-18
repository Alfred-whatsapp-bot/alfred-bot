import { storage } from "../storage.js";

export const stageFour = {
  async exec({ from, message, client }) {
    if (message == "CARTÃO" || message == "DINHEIRO" || message == "OUTRO") {
      storage[from].payment = message;
      const msg = `📝 *Alguma informação adicional?*`;
      await client.sendText(from, msg);
      storage[from].stage = 4;
    } else {
      const address = storage[from].address;
      const phone = from.split("@");
      const itens = storage[from].itens;
      const itensList = itens.map((item, index) => {
        return `*${item.nome}*`;
      });

      const total = storage[from].total;

      storage[from].stage = 0;
      storage[from].itens = [];

      const msg = `🔔 *NOVO PEDIDO* 🔔: \n\n📞 Cliente: +${phone[0]} \n🧁 Pedidos: ${itensList} \n📍 Endereço: *${address}* \n💰 Valor total: *R$ ${total}*. \n⏳ Tempo de entrega: *50 minutos*. \n🛑 Forma de pagamento: *${storage[from].payment}* \n✏️ Observações: *${message}* \n\n📲 Obrigado por comprar conosco!`;

      await client.sendText(from, msg);
    }
  },
};
