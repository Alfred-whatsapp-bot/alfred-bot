
import { storage } from "../storage.js";
import { getProdutoById } from "../../repository/repository.mjs";

export const stageTwo = {
  exec({ from, message, client }) {
    const order =
      "\n-----------------------------------\n#️⃣ - ```FINALIZAR pedido``` \n*️⃣ - ```CANCELAR pedido```";
    if (message === "*") {
      storage[from].stage = 0;
      storage[from].itens = [];

      return "🔴 Pedido *CANCELADO* com sucesso. \n\n ```Volte Sempre!```";
    } else if (message === "#") {
      storage[from].stage = 3;

      return (
        "🗺️ Agora, informe o *BAIRRO* e *NOME DA RUA*.\n\n " +
        "\n-----------------------------------\n*️⃣ - ```CANCELAR pedido```"
      );
    } else {
      getProdutoById(message).then((data) => {
        if (data != null) {
          data.map((item) => {
            storage[from].itens.push(item);
            const itens = storage[from].itens;
            const itensList = itens.map((item, index) => {
              return `*${item.nome}* - R$ ${item.valor}`;
            });
            client.sendText(
              from,
              `✅ *${item.nome}* adicionado com sucesso! \n` +
                `\n Carrinho: \n ${itensList}` +
                "\n\n ```Digite outra opção```:" +
                order
            );
          });
        } else {
          client.sendText(
            from,
            "❌ *Código inválido* \n\n" + "```Digite novamente```: \n\n" + order
          );
        }
      });
    }
  },
};
