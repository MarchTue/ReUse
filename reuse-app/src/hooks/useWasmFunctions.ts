// 'use client';

import * as  wasm from "../lib/pkg/wasm_wallet";
import { useCallback } from "react";

export function useWasmFunctions() {
  const generateMnemonic = useCallback((): string => {
    try {
      return wasm.generate_new_mnemonic();
    } catch (error) {
      console.error("WASM Mnemonic generation failed:", error);
      throw new Error("WASM 오류 : 니모닉 생성 실패");
    }
  }, []);

  const getAddress = useCallback((mnemonic: string, passphrase: string = ""): string => {
    try {
      return wasm.get_eth_address(mnemonic, passphrase);
    } catch (error) {
      console.error("WASM GET Address failed :", error);
      throw new Error("WASM 오류 : 주소 조회 실패");
    }
  }, []);

  return { generateMnemonic, getAddress };
}

