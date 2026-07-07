import * as Comlink from "comlink";
import { textToImage } from "./textRenderer";

const api = {
  async textToImage(params) {
    return await textToImage(params);
  },
};

Comlink.expose(api);