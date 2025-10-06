"use client";
import SubHeader from "@/components/common/subHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWalletStore } from "@/store/walletStore";
import { KeyRound, Wallet, Lock, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface MenuItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
  iconClass: string;
}


export default function WalletMainPage() {
  const router = useRouter();
  const {
    isConnected,
    hasWalletData,
    address,
    lockWallet
  } = useWalletStore();

  const isCreateDisabled = hasWalletData;
  const isMnemonicDisabled = !isConnected;
  const isRestoreDisabled = hasWalletData;

  const statusText = hasWalletData
    ? (
      isConnected
        ? <span className="text-primary-100">연결됨</span>
        : <span className="text-gray-300">잠금 상태</span>
    ) : <span>블록체인 지갑이 없습니다.</span>;

  const lockUnlockPath = isConnected ? '/wallet/lock' : '/wallet/unlock';
  const lockUnlockTitle = isConnected ? "지갑 잠그기 (Lock)" : "지갑 잠금 해제 (Unlock)";
  const lockUnlockDesc = isConnected ? "지갑을 잠금 상태로 전환" : "비밀번호를 입력하여 지갑 활성화";
  const lockUnlockIcon = isConnected ? Lock : KeyRound;
  const lockUnlockIconClass = isConnected ? 'text-primary' : 'text-primary';

  const handleLockUnlockClick = () => {
    if (isConnected) {
      lockWallet();
    } else {
      router.push('/wallet/unlock');
    }
  };

  return (
    <div>
      <SubHeader title="지갑 메뉴" />
      {/* 지갑 상태 */}

      <div className="p-4 bg-gray-50 border-b">
        <Card className="border-2">
          <CardContent className="p-6 py-4">
            <div className={`flex items-center p-3 rounded-sm`}>
              <Wallet className={`w-6 h-6 mr-3 ${hasWalletData ? 'text-blue-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-semibold text-gray-700">지갑 상태</p>
                <p className="text-sm">
                  {statusText}
                </p>
                {isConnected && address && (
                  <p className="text-xs text-gray-500 mt-1 truncate">주소: {address}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* 지갑 상태 ends */}

      <div className="flex flex-col">
        {/* 지갑 생성 */}
        <MenuItem
          description={isCreateDisabled ? "새로운 지갑은 생성할 수 없습니다." : "새로운 블록체인 지갑 생성"}
          disabled={isCreateDisabled}
          icon={Zap}
          iconClass={isCreateDisabled ? "text-gray" : "text-blue-600"}
          onClick={() => router.push('/wallet/create-or-recover')}
          title="블록체인 지갑 신규 생성"
        />
        {/* 지갑 복구 */}
        <MenuItem
          description={"복구 구문을 통해 지갑을 복구합니다."}
          disabled={isRestoreDisabled}
          icon={Lock}
          iconClass="text-gray-600"
          onClick={() => router.push('/wallet/import')}
          title="블록체인 지갑 복구"
        />
        {/* 복구 코드 확인 */}
        <MenuItem
          description={isMnemonicDisabled ? "잠금 해제 후 확인할 수 있습니다." : "블록체인 복구 코드를 확인합니다."}
          disabled={isMnemonicDisabled}
          icon={KeyRound}
          iconClass="text-primary"
          onClick={() => router.push('/wallet/view-mnemonic')}
          title="지갑 복구 코드 확인"
        />
        {/* 잠금 & 잠금 해제 - 지갑 데이터 있는 경우에만. */}
        {hasWalletData &&
          <MenuItem
            description={lockUnlockDesc}
            disabled={false}
            icon={lockUnlockIcon}
            iconClass={lockUnlockIconClass}
            onClick={handleLockUnlockClick}
            title={lockUnlockTitle}
          />}
      </div>
    </div>
  );
}

/**
 *   메뉴 아이템
**/
const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  disabled,
  iconClass
}) => {
  const disabledStyle = disabled
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:bg-gray-100 cursor-pointer';

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`p-4 border-gray-200 border-b bg-gray-50 transition-colors duration-200 ${disabledStyle}`}
    >
      <div className="flex items-center">
        <Icon className={`w-6 h-6 mr-3 ${iconClass}`} />
        <div>
          <p className={`font-semibold text-gray-700 ${disabled ? 'text-gray-500' : ''}`}>{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};