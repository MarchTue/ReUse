"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Heart, Share } from "lucide-react";

export default function ItemHeader({ title }: { title: string; }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  // tqh : 좋아요 확인, 좋아요 호출.
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-10 border-b border-gray-100">
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="w-10 h-10 rounded-full">
        <ArrowLeft className="w-6 h-6" />
      </Button>
      <p className="text-lg font-semibold">{title}</p>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)} className="w-10 h-10 rounded-full">
          <Heart className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
        </Button>
        <Button variant="ghost" size="sm" className="w-10 h-10 rounded-full">
          <Share className="w-6 h-6 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}
