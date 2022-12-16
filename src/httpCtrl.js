#!/usr/bin/env node

import { chatbotOptions } from "./config";
import { httpCtrl } from "./server";

/* Http chatbot control server (http://localhost:3000/) */
/* -----------------------------------------------------*/
httpCtrl("chatbotSession2", chatbotOptions.httpCtrl.port);
