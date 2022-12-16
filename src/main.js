#!/usr/bin/env node

// import schedule from "node-schedule";
<<<<<<< HEAD
//import { session, log } from "./server.js";
import { session } from "./server.js";
=======
import { session, log } from "./server.js";
// import { session } from "./server.js";
>>>>>>> luis
import { stages } from "./stages";

<<<<<<< HEAD
session("chatbotSession", stages);
=======
//try {
/* Single WhatsApp account */
/* ------------------------*/
session("chatbotSession2", stages);
// OR:
// const chatbot = await session("chatbotSession", conversation);
/* ---------------------------*/

/* Multiple WhatsApp accounts */
/* ---------------------------*/
// session("chatbotSession", conversation1);
// session("chatbotSession", conversation2);
// OR:
// const chatbot1 = await session("chatbotSession", conversation1);
// const chatbot2 = await session("chatbotSession", conversation2);
// ...
/* ---------------------------*/

/* Schedule Jobs */
/* ---------------------------*/
// const job1 = schedule.scheduleJob(
//   jobsOptions.job1.rule,
//   async () => {
//     // custom logic
//   }
// );
/* ---------------------------*/
// } catch (error) {
//   console.log("error", error.toString());
//   log("Error", `${error.toString()} Please try restart de bot.`);
// }
>>>>>>> luis
