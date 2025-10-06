'use client';

import SubHeader from "@/components/common/subHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/customInput";
import { useWalletStore } from "@/store/walletStore";
import { Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function WalletCreateOrRecover() {
  const router = useRouter();

  const createWallet = useWalletStore(state => state.createWalletAndConnect);
  const storeError = useWalletStore(state => state.error);
  const clearError = useWalletStore(state => state.clearError);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleCreateWallet = async () => {
    setLocalError('');
    clearError();

    if (password.length < 6) {
      setLocalError('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setIsLoading(true);

    try {
      await createWallet(password);
      router.replace('/wallet');
    } catch (e) {
      console.error(e);
      setLocalError(`지갑 생성 실패: ${storeError || "알 수 없는 시스템 오류"}`);
    }
    finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <SubHeader title="새 지갑 생성" />

      <div className="p-6 max-w-lg mx-auto">
        <Card className="shadow-lg">
          <CardContent className="p-6 space-y-4">
            <div className="text-center mb-6">
              <Zap className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h2 className="text-xl font-bold">비밀번호 설정</h2>
              <p className="text-sm text-gray-500">지갑 암호화에 사용될 비밀번호를 설정하세요.</p>
            </div>

            <Input
              type="password"
              placeholder="새 비밀번호 (6자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />

            {(localError || storeError) && (
              <p className="text-red-500 mt-4 text-sm text-center">{localError || storeError}</p>
            )}

            <Button
              onClick={handleCreateWallet}
              disabled={isLoading || password !== confirmPassword || password.length < 6}
              className="w-full h-12 bg-primary-500 hover:bg-primary-600 text-white font-semibold"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "지갑 생성 및 시작하기"
              )}
            </Button>

            <Button
              onClick={() => router.push('/wallet/import')}
              variant="link"
              className="w-full text-sm text-gray-400"
            >
              기존 복구 구문으로 복구하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}