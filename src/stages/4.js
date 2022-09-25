import { storage } from "../storage.js";

export const stageFour = {
  exec({ from, message }) {
    const address = storage[from].address;
    const totalFormatted = storage[from].total;
    const phone = from.split("@");

    storage[from].stage = 5;
    let desserts = "";
    const itens = storage[from].itens;
    itens.map((item, index) => {
      if (index == itens.length - 1) {
        desserts += item.description + ".";
      } else {
        desserts += item.description + ", ";
      }
    });

    return `🔔 *NOVO PEDIDO* 🔔: \n\n📞 Cliente: +${
      phone[0]
    } \n🧁 Sabores: *${desserts}* \n📍 Endereço: *${address}* \n💰 Valor total: *${Math.ceil(
      totalFormatted
    ).toFixed(
      2
    )}*. \n⏳ Tempo de entrega: *50 minutos*. \n🛑 Detalhes: *${message}*`;
  },
};
