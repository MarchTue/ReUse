"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge, Edit2 } from "lucide-react";


export default function UserProfile() {

  const userInfo = {
    name: '삼월화',
    RU: 20000
  };

  return (
    <div className="p-4 space-y-2">
      <Card className="border-0 shadow-sm py-2">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">

            <Avatar className="w-12 h-12 bg-slate-300">
              <AvatarFallback className="text-xl justify-center">{userInfo.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-bold">{userInfo.name}</h2>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <Edit2 className="w-6 h-6"></Edit2>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

  );
}