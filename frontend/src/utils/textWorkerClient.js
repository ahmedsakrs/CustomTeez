import * as Comlink from "comlink";

const worker = new Worker(
  new URL("./textWorker.js", import.meta.url),
  {
    type: "module",
  }
);

export const textWorker =
  Comlink.wrap(worker);