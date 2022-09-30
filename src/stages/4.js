import { storage } from "../storage.js";

export const stageFour = {
  exec({ from, message, client }) {
    const address = storage[from].address;
    const phone = from.split("@");
    const itens = storage[from].itens;
    const itensList = itens.map((item, index) => {
      return `*${item.nome}*`;
    });

    const total = storage[from].total;

    storage[from].stage = 0;
    storage[from].itens = [];

    const msg = `🔔 *NOVO PEDIDO* 🔔: \n\n📞 Cliente: +${
      phone[0]
    } \n🧁 Pedidos: ${itensList} \n📍 Endereço: *${address}* \n💰 Valor total: *R$ ${Math.ceil(
      total
    )}*. \n⏳ Tempo de entrega: *50 minutos*. \n🛑 Detalhes: *${message}* \n\n📲 Obrigado por comprar conosco!`;

    //client.sendText("HgdbSMbwzlv0fna8g40452@g.us", msg); // Teste envio de mensagem para grupo
    client.sendText(from, msg);
  },
};
