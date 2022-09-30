import { storage } from "../storage";

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
