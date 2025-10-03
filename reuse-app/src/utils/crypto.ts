// 'use client'; 

export interface IEncryptedData {
  cipherText: string;
  iv: string;
  salt: string;
}

const ITERATIONS = 100000;
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;

async function getKeyFromPassword(password: string, salt: BufferSource): Promise<CryptoKey> {
  const enc = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * 니모닉을 사용자 비밀번호로 암호화
 */
export async function encryptMnemonic(password: string, mnemonic: string): Promise<EncryptedData> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

  const key = await getKeyFromPassword(password, salt);

  const enc = new TextEncoder();
  const encodedMnemonic = enc.encode(mnemonic);

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv: iv },
    key,
    encodedMnemonic
  );

  return {
    cipherText: Buffer.from(cipherBuffer).toString('base64'),
    iv: Buffer.from(iv).toString('base64'),
    salt: Buffer.from(salt).toString('base64'),
  };
}

/**
 * 암호화된 데이터를 사용자 비밀번호로 복호화
 */
export async function decryptMnemonic(password: string, data: EncryptedData): Promise<string> {
  try {
    const salt = Buffer.from(data.salt, 'base64');
    const iv = Buffer.from(data.iv, 'base64');
    const cipherBuffer = Buffer.from(data.cipherText, 'base64');

    const key = await getKeyFromPassword(password, salt);

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv: iv },
      key,
      cipherBuffer.buffer.slice(cipherBuffer.byteOffset, cipherBuffer.byteOffset + cipherBuffer.byteLength)
    );

    const dec = new TextDecoder();
    return dec.decode(decryptedBuffer);

  } catch (e) {
    console.error("복호화 중 오류 발생 (잘못된 비밀번호 가능성):", e);
    throw new Error("DECRYPTION_FAILED");
  }
}