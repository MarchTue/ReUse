import * as wasmModule from "./pkg/wasm_wallet";

let wasm: typeof wasmModule | null = null;

export const initWasm = async () => {
  if (wasm) return wasm;

  wasm = wasmModule;
  return wasm;
};