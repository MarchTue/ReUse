// 'use client';

import { openDB, IDBPDatabase } from 'idb';
import { encryptMnemonic, decryptMnemonic, IEncryptedData } from '@/utils/crypto';

const DB_NAME = "WasmWalletDB";
const STORE_NAME = "walletStore";
const WALLET_KEY = "wallet_key_data";
const DB_VERSION = 1;

/**
 * IDB 연결 객체를 반환하는 헬퍼
 */
const getDb = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) { db.createObjectStore(STORE_NAME); }
  });
};

export const idbStorage = {
  hasWalletData: async (): Promise<boolean> => {
    const db = await getDb();
    return (await db.get(STORE_NAME, WALLET_KEY)) !== undefined;
  },
  saveMnemonic: async (password: string, mnemonic: string): Promise<void> => {
    const encryptedData = await encryptMnemonic(password, mnemonic);
    const db = await getDb();
    await db.put(STORE_NAME, JSON.stringify(encryptedData), WALLET_KEY);
  },
  loadMnemonic: async (password: string): Promise<string | null> => {
    const db = await getDb();
    const storedDataString = await db.get(STORE_NAME, WALLET_KEY);

    if (!storedDataString) return null;

    const storedData: IEncryptedData = JSON.parse(storedDataString);
    return await decryptMnemonic(password, storedData);
  }
};