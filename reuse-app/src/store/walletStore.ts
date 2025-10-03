import { idbStorage } from "@/hooks/useIdbStorage";
import { useWasmFunctions } from "@/hooks/useWasmFunctions";
import { create } from "zustand";
import { persist } from 'zustand/middleware';

const wasm = useWasmFunctions();


interface IWalletState {
  address: string | null;
  isConnected: boolean;
  hasWalletData: boolean;
  isInitialized: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  connectWallet: (password: string) => Promise<void>;
  createWalletAndConnect: (password: string) => Promise<void>;
  importWalletAndConnect: (mnemonic: string, password: string) => Promise<void>;
  clearError: () => void;
}


/**
 * ### WASM, IndexedDB, Persist 미들웨어를 통합한 지갑 상태 관리 스토어.
 * 
 * #### 모든 지갑의 상태 및 비동기 로직은 이 스토어를 통해 처리되어야 함.
 * 
 * @property {string | null} address - 현재 연결된 지갑의 주소. (연결 해제 시 null)
 * @property {boolean} isConnected - 지갑이 비밀번호로 잠금 해제되어 WASM 기능을 사용할 수 있는 상태 (새로고침 시 false로 리셋).
 * @property {boolean} hasWalletData - IndexedDB에 암호화된 니모닉 데이터가 존재하는지 여부. (persist되어 빠른 로딩에 사용)
 * @property {boolean} isInitialized - Store의 초기화 (IDB 상태 확인)가 완료되었는지 여부.
 * @property {string | null} error - 발생한 오류 메시지.
 * @function initialize - 앱 시작 시 IDB 상태를 확인하여 hasWalletData를 설정하는 초기화 함수.
 * @function connectWallet - 비밀번호를 사용하여 IDB에서 니모닉을 복호화하고 WASM 검증 후 지갑을 잠금 해제(Unlock)하는 함수.
 * @function createWalletAndConnect - 새로운 니모닉을 생성, IDB에 암호화 저장 후 지갑을 연결하는 함수.
 * @function importWalletAndConnect - 외부 니모닉으로 지갑을 복구하고 IDB에 저장하는 함수.
 * @function clearError - 현재 오류 상태를 초기화하는 함수.
 */
export const useWalletStore = create<IWalletState>()(
  persist(
    (set, get) => ({
      address: null,
      isConnected: false,
      hasWalletData: false,
      isInitialized: false,
      error: null,

      clearError: () => set({ error: null }),

      // store 초기화
      initialize: async () => {
        try {
          const hasData = await idbStorage.hasWalletData();
          set({ hasWalletData: hasData, isInitialized: true });
        } catch (e) {
          set({ error: "IDB 초기화 오류", isInitialized: true });
        }
      },
      createWalletAndConnect: async (password) => {
        try {
          get().clearError();
          const mnemonic = wasm.generateMnemonic();
          const newAddress = wasm.getAddress(mnemonic, ""); // passphrase는 ""로 우선 고정함.

          await idbStorage.saveMnemonic(password, mnemonic);
          set({ address: newAddress, isConnected: true, hasWalletData: true });
        } catch (error) {
          set({ error: "지갑 생성 실패" });
          throw error;
        }
      }, // createWalletAndConnect ends

      // idb 복호화 및 검증
      connectWallet: async (password) => {
        try {
          get().clearError();
          const mnemonic = await idbStorage.loadMnemonic(password);
          if (!mnemonic) throw new Error("키 데이터가 없습니다.");

          const currentAddress = wasm.getAddress(mnemonic, "");

          set({ address: currentAddress, isConnected: true, hasWalletData: true, error: null });

        } catch (error) {
          set({ error: "연결 실패: 비밀번호 오류 또는 데이터 손상" });
          throw error;
        }
      }, // connectWallet ends

      // 니모닉 -> 계좌 복구
      importWalletAndConnect: async (mnemonic, password) => {
        try {
          get().clearError();
          const importedAddress = wasm.getAddress(mnemonic, "");

          await idbStorage.saveMnemonic(password, mnemonic);
          set({ address: importedAddress, isConnected: true, hasWalletData: true, error: null });

        } catch (error) {
          set({ error: "복구 실패: 니모닉 형식 또는 WASM 오류" });
          throw error;
        }
      }, // importWalletAndConnect ends


    }),
    // options
    {
      name: "wallet-storage",
      partialize: (state) => ({
        hasWalletData: state.hasWalletData,
        isInitialized: state.isInitialized
      }),
    }
  )
);