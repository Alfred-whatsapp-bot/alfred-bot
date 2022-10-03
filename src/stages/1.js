import { storage } from "../storage.js";
import { getAllCategorias } from "../../repository/repository.mjs";

export const stageOne = {
  async exec({ from, message, client }) {
    if (message == "FALAR COM ATENDENTE") {
      storage[from].stage = 5;
      storage[from].itens = [];
      const phone = from.split("@");

      const msg =
        "🔴 Aguarde enquanto eu conecto você com um atendente. \n\n ```Volte Sempre!```";

      client.sendText(from, msg); // Teste envio de mensagem para grupo
    } else {
      //   await getAllCategorias()
      //     .then(async (data) => {
      //       const categorias = data.map((item) => {
      //         return item.categoria;
      //       });

      //       let botoes = [];
      //       let array = [];
      //       let array2 = [];
      //       let count = 0;
      //       for (const element of categorias) {
      //         botoes = {
      //           buttonText: {
      //             displayText: element,
      //           },
      //         };
      //         count++;
      //         if (count < 3) {
      //           array2.push(botoes);
      //         } else {
      //           array.push(botoes);
      //         }
      //       }

      //       console.log(array);
      //       console.log(array2);

      //       storage[from].stage = 2;
      //       await client.sendButtons(from, "Escolha uma categoria:", array, " ");
      //       await client.sendButtons(from, "Temos também:", array2, " ");
      //     })
      //     .then((result) => {
      //       console.log("Result: ", result); //return object success
      //     })
      //     .catch((erro) => {
      //       console.error("Error when sending: ", erro); //return object error
      //     });
      // }

      await getAllCategorias().then(async (data) => {
        const categorias = data.map((item) => {
          return item.categoria;
        });
        console.log(categorias);
        let categoriaList = [];
        let array = [];
        for (const categoria of categorias) {
          (categoriaList = {
            title: " ",
            rows: [
              {
                title: `${categoria}`,
                description: "",
              },
            ],
          }),
            array.push(categoriaList);
        }
        console.log(array);
        storage[from].stage = 2;
        await client
          .sendListMenu(
            from,
            "Escolha uma categoria",
            "Subtitulo",
            "Bom Apetite!",
            "MENU",
            array
          )
          .then((result) => {
            console.log("Result: ", result); //return object success
          })
          .catch((erro) => {
            console.error("Error when sending: ", erro); //return object error
          });
      });
    }
  },
};
