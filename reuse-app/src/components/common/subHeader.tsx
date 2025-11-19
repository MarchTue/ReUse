"use client";

import { ChevronLeft, Edit } from "lucide-react";
import { Button } from "../ui/button";
// import { useRouter } from "next/router";
import { useRouter } from 'next/navigation';

export default function SubHeader({
  title, mode = "main", onBackClick
}: { title: string; mode?: "main" | "sub"; onBackClick?: () => void; }) {
  const router = useRouter();
  const handleBack = onBackClick || (() => router.back());
  return (
    <>
      <div className="bg-white border-b px-4 py-4">


        {mode === "main"
          ? (
            <div className="flex items-center justify-center">
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
          )
          : (
            <div className="flex items-center justify-between">
              <ChevronLeft className="w-6" onClick={handleBack} />
              <h1 className="text-xl font-semibold">{title}</h1>
              <span className="w-6"></span>
            </div>
          )
        }

        {/* 완료 버튼 관련 넣기 */}
      </div>
    </>);
}

//<Button variant="ghost" size="sm" onClick={() => router.push("/profile/edit")}>
// <Edit className="w-5 h-5" />
// </Button>