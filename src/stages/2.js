import { storage } from "../storage.js";
import { getProdutosByCategory } from "../../repository/repository.mjs";

export const stageTwo = {
  exec({ from, message, client }) {
    const buttons = [
      {
        buttonText: {
          displayText: "FINALIZAR pedido",
        },
      },
      {
        buttonText: {
          displayText: "CANCELAR pedido",
        },
      },
    ];
    if (message == "CANCELAR pedido") {
      storage[from].stage = 0;
      storage[from].itens = [];

      let msg0 = "🔴 Pedido cancelado com sucesso! \n\n ```Volte Sempre!```";
      client.sendText(from, msg0);
    } else if (message == "FINALIZAR pedido") {
      storage[from].stage = 3;
      let msg = " 🗺️ Agora, informe o *ENDEREÇO COMPLETO*.\n\n ";
      client.sendText(from, msg);
    } else {
      getProdutosByCategory(message)
        .then((data) => {
          if (data.length > 0) {
            data.map((item) => {
              const itensList = data.map((item, index) => {
                return `*${item.nome}* - R$ ${item.valor}`;
              });

              const cardapio = `📋 *CARDÁPIO* \n\n` + itensList.join("\n");
              client.sendText(from, cardapio);
            });
          } else {
            client.sendText(from, "Categoria não encontrada!");
          }
        })
        .catch((err) => {
          console.log(err);
        }, 0);
    }
  },
};
