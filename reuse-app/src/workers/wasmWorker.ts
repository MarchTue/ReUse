import * as wasmModule from "../lib/pkg/wasm_wallet";
import { WorkerResponse, WorkerRequest, PermitPayload, WorkerTaskType } from "@/types/worker.type";

const selfWorker = self as unknown as Worker;


selfWorker.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const { id, type, payload } = e.data;

  try {
    let result: string;

    switch (type) {
      case "SIGN_ETH_MESSAGE": {
        const { mnemonic, passphrase, message } = payload as { mnemonic: string, passphrase: string, message: string; };
        result = await wasmModule.sign_eth_message(
          mnemonic,
          passphrase,
          message
        );
        break;
      }
      case "SIGN_PERMIT": {
        const p = payload as PermitPayload;
        result = await wasmModule.sign_eip2612_permit(
          p.mnemonic, p.passphrase, p.owner, p.spender,
          p.value, p.nonce, p.deadline, p.contract, p.chainId
        );
        break;
      }
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  } catch (error) {
    const errorMessage = (error as Error).toString();
    const response: WorkerResponse = { id, type: type as WorkerTaskType, error: errorMessage };
    selfWorker.postMessage(response);
  }
}; 