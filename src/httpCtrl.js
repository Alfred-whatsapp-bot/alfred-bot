#!/usr/bin/env node

import { chatbotOptions } from "./config";
import { httpCtrl } from "./server";

/* Http chatbot control server (http://localhost:3000/) */
/* -----------------------------------------------------*/
httpCtrl("alfredSess", chatbotOptions.httpCtrl.port);
