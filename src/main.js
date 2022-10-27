#!/usr/bin/env node

import { session } from "./server.js";
import { stages } from "./stages";
// import conversation1 from './conversations/conversation1.js';
// import conversation2 from './conversations/conversation2.js';

/* Single WhatsApp account */
/* ------------------------*/
session("chatbotSession", stages);

/* Multiple WhatsApp accounts */
/* ---------------------------*/
// session("chatbotSession", conversation1);
// session("chatbotSession", conversation2);
// ...
/* ---------------------------*/
