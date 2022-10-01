import { storage } from "../storage.js";
import { getAllCategorias } from "../../repository/repository.mjs";

export const stageOne = {
  exec({ from, message, client }) {
    if (message == "FALAR COM ATENDENTE") {
      storage[from].stage = 5;
      storage[from].itens = [];
      const phone = from.split("@");

      const msg = `🔔 *NOVO PEDIDO* 🔔: \n\n📞 Cliente: +${phone[0]} \n📲 Deseja falar com um atendente!`;

      client.sendText("HgdbSMbwzlv0fna8g40452@g.us", msg); // Teste envio de mensagem para grupo

      return "🔴 Aguarde enquanto eu conecto você com um atendente. \n\n ```Volte Sempre!```";
    } else {
      getAllCategorias()
        .then((data) => {
          const categorias = data.map((item) => {
            return item.categoria;
          });

          let botoes = [];
          let array = [];
          let array2 = [];
          let count = 0;
          for (const element of categorias) {
            botoes = {
              buttonText: {
                displayText: element,
              },
            };
            count++;
            if (count < 3) {
              array2.push(botoes);
            } else {
              array.push(botoes);
            }
          }

          console.log(array);
          console.log(array2);

          storage[from].stage = 2;
          client.sendButtons(from, "Temos também:", array2, " ");
          client.sendButtons(from, "Escolha uma categoria:", array, " ");
        })
        .then((result) => {
          console.log("Result: ", result); //return object success
        })
        .catch((erro) => {
          console.error("Error when sending: ", erro); //return object error
        });
    }
  },
};
