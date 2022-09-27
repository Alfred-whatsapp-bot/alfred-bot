import { storage } from "../storage.js";

export const stageFour = {
  exec({ from, message }) {
    const address = storage[from].address;
    const phone = from.split("@");
    const itens = storage[from].itens;
    const itensList = itens.map((item, index) => {
      return `*${item.nome}*`;
    });

    const total = storage[from].total;

    storage[from].stage = 0;
    storage[from].itens = [];

    return `🔔 *NOVO PEDIDO* 🔔: \n\n📞 Cliente: +${
      phone[0]
    } \n🧁 Pedidos: ${itensList} \n📍 Endereço: *${address}* \n💰 Valor total: *${Math.ceil(
      total
    )}*. \n⏳ Tempo de entrega: *50 minutos*. \n🛑 Detalhes: *${message}*`;
  },
};
