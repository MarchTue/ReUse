"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Star, Badge } from "lucide-react";
import { userInfo } from "os";

export default function CurrentToken() {
  // 유저 지갑정보로 토큰 가져와야 함. 혹은 백엔드가 물어다 줌

  const userInfo = {
    name: '삼월화',
    RU: 20000
  };

  return (
    <div className="p-4 space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-bold">보유중인 토큰</h2>
              </div>
              <div className="flex items-center space-x-4">
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}