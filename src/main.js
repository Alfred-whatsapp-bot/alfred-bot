#!/usr/bin/env node

// import schedule from "node-schedule";
//import { session, log } from "./server.js";
import { session } from "./server.js";
import { stages } from "./stages";

session("chatbotSession", stages);
