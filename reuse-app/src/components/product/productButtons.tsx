"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { MessageCircle } from "lucide-react";
import { IProductInfo, ISeller } from "@/types/product";

export default function ProductButtons({ productInfo, seller }: { productInfo: IProductInfo; seller: ISeller; }) {
  const router = useRouter();
  //  tqh : chat 쪽 백엔드 구성 참조
  return (
    <div className="left-0 right-0 bg-white px-6 py-4 border-t fixed bottom-0">
      <div className="flex items-center space-x-3">
        <Button
          className="flex-1 h-14 font-semibold rounded-xl bg-white  text-primary-500 border border-primary-500 hover:bg-slate-100 duration-200"
          onClick={() => router.push(`/chat/seller/${productInfo.id}`)}
        ><MessageCircle />채팅하기</Button>
        <Button
          className="flex-1 h-14 font-semibold rounded-xl duration-300"
          onClick={() => router.push(`/product/${productInfo.id}/offer`)}
        >가격제안</Button>
      </div>
    </div>
  );
}
