"use client";

import { Edit } from "lucide-react";
import { Button } from "../ui/button";
// import { useRouter } from "next/router";
import { useRouter } from 'next/navigation';

export default function SubHeader({
  title, mode = "main"
}: { title: string; mode?: "main" | "sub"; }) {
  const router = useRouter();
  return (
    <>
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center justify-center">
          {/* 뒤로가기 버튼 넣기 */}
          <h1 className="text-xl font-semibold">{title}</h1>
          {/* 완료 버튼 관련 넣기 */}
        </div>
      </div>
    </>);
}

//<Button variant="ghost" size="sm" onClick={() => router.push("/profile/edit")}>
// <Edit className="w-5 h-5" />
// </Button>