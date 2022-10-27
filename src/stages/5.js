import { storage } from "../storage.js";
import { buttons } from "../helpers/helpers";

/**
 * The client is connection ended here. In 60 seconds, it'll closed.
 */
export const finalStage = {
  exec({ from, message, client }) {
    setTimeout(() => {
      storage[from].stage = 0;
    }, 1800000);
  },
};
