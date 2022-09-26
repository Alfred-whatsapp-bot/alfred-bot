import { storage } from "../storage.js";
import { getAllProdutos } from "../../repository/repository.mjs";

export const stageOne = {
  exec({ from, message, client }) {
    if (message != "1") {
      storage[from].stage = 0;
      storage[from].itens = [];

      return "🔴 Pedido *CANCELADO* com sucesso. \n\n ```Volte Sempre!```";
    } else {
      getAllProdutos()
        .then((data) => {
          const order =
            "\n-----------------------------------\n#️⃣ - ```FINALIZAR pedido``` \n*️⃣ - ```CANCELAR pedido```";
          let menu = "";
          data.forEach((item) => {
            menu += `\n*${item.nome}* - R$ ${item.valor}`;
          });
          storage[from].stage = 2;
          client.sendText(from, `📋 *Cardápio* 📋: \n\n${menu}\n\n${order}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
};
