/**
 *  Worker로 작동해야 하는 무거운 작업을 정의함
 * 
 *   @type  `SIGN_ETH_MESSAGE` | `SIGN_PERMIT`
 */
export type WorkerTaskType = 'SIGN_ETH_MESSAGE' | 'SIGN_PERMIT';

export type WorkerRequest = {
  id: number;
  type: WorkerTaskType;
  payload: any;
};

export type WorkerResponse = {
  id: number;
  type: WorkerTaskType;
  result?: string;
  error?: string;
};

export interface PermitPayload {
  mnemonic: string;
  passphrase: string;
  owner: string;
  spender: string;
  value: number;
  nonce: number;
  deadline: number;
  contract: string;
  chainId: number;
}