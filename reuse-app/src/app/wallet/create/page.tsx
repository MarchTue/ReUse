'use client';

import { getWasmFunctions } from "@/utils/getWasmFunctions";
import { useEffect, useState, useCallback } from "react";

export default function WalletTestPage() {
  const { generateMnemonic, getAddress } = getWasmFunctions();

  const [generatedMnemonic, setGeneratedMnemonic] = useState<string | null>(null);
  const [inputMnemonic, setInputMnemonic] = useState<string>('');
  const [passphrase, setPassphrase] = useState<string>('');
  const [derivedAddress, setDerivedAddress] = useState<string | null>(null);
  const [restoredAddress, setRestoredAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const newMnemonic = generateMnemonic();
      const initialAddress = getAddress(newMnemonic, passphrase);

      setGeneratedMnemonic(newMnemonic);
      setDerivedAddress(initialAddress);
      setInputMnemonic(newMnemonic);

    } catch (e) {
      setError(`생성 오류: ${(e as Error).message}`);
    }
  }, [generateMnemonic, getAddress]);


  const handleRestoreCheck = useCallback(() => {
    setError(null);
    if (!inputMnemonic) {
      setRestoredAddress(null);
      return;
    }
    try {
      const addressFromInput = getAddress(inputMnemonic, passphrase);
      setRestoredAddress(addressFromInput);

    } catch (e) {
      setError(`복구 검증 실패: ${(e as Error).message}. (니모닉 형식 오류 또는 WASM 오류)`);
      setRestoredAddress("복구 실패");
    }
  }, [inputMnemonic, passphrase, getAddress]);

  useEffect(() => {
    handleRestoreCheck();
  }, [inputMnemonic, passphrase, handleRestoreCheck]);


  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>WASM 지갑 기능 검증 페이지 (생성/복구)</h1>
      <p>WASM의 **복구 로직(`get_eth_address`)**이 생성 로직과 동일한 주소를 파생하는지 확인합니다.</p>

      <div style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
        <h3>WASM 생성 로직 검증 (Source)</h3>
        <p><strong>생성된 니모닉:</strong> <code style={{ wordBreak: 'break-all' }}>{generatedMnemonic || '로딩 중...'}</code></p>
        <p><strong>파생된 주소:</strong> <code style={{ color: 'blue' }}>{derivedAddress || '로딩 중...'}</code></p>
      </div>

      <div style={{ border: '1px solid #0070f3', padding: '15px', marginBottom: '20px' }}>
        <h3>WASM 복구 로직 검증 (Test)</h3>

        <label>
          패스프레이즈 (옵션, 미저장 권장):
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </label>

        <label>
          복구할 니모닉:
          <textarea
            rows={3}
            value={inputMnemonic}
            onChange={(e) => setInputMnemonic(e.target.value)}
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </label>

        <p><strong>복구 검증 주소:</strong> <code style={{ color: restoredAddress === derivedAddress && derivedAddress ? 'green' : 'red' }}>{restoredAddress || '입력 대기 중...'}</code></p>

        {generatedMnemonic && derivedAddress && restoredAddress && (
          <p style={{ fontWeight: 'bold', color: restoredAddress === derivedAddress ? 'green' : 'red' }}>
            {restoredAddress === derivedAddress ? ' 검증 성공: 주소가 일치합니다.' : ' 검증 실패: 주소가 일치하지 않습니다.'}
          </p>
        )}
      </div>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>오류: {error}</p>}
    </div>
  );
}