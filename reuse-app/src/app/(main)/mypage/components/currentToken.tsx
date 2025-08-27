"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star, Badge, Wallet, DollarSign } from "lucide-react";
import { useRouter } from "next/navigation";
import { userInfo } from "os";

export default function CurrentToken() {
  // 유저 지갑정보로 토큰 가져와야 함. 혹은 백엔드가 물어다 줌

  const userInfo = {
    name: '삼월화',
    RU: 20000
  };

  const router = useRouter();

  const onClickButton = (target: string) => {
    router.push(target);
  };

  return (
    <div className="p-4 space-y-6 pt-0">
      <Card className="border-2 shadow-sm">
        <CardContent className="p-6 py-0">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1 justify-around ">
                <p className="text-base font-semibold">보유중인 토큰</p>
                {/* tqh : 유저 정보로 토큰 잔액 가져오기 */}
                <p className="text-xl font-bold">{userInfo.RU}  RU</p>
              </div>
              <div className="flex justify-around pt-4 pb-0">
                <Button className="text-base" onClick={() => onClickButton("/token/charge")}>
                  <Wallet />
                  충전하기
                </Button>
                <Button className="text-base" onClick={() => onClickButton("/token/exchange")}>
                  <DollarSign />
                  송금하기
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}