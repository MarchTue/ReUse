import { ISeller } from "@/types/product";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent } from "../ui/card";
import { Shield, Star } from "lucide-react";

export default function ProductSeller({ seller }: { seller: ISeller; }) {
  return (
    <div className="px-6 py-2">
      <hr className="h-2 my-2" />
      <h1 className="font-semibold mb-2">판매자 정보</h1>
      <Card className="border-1 bg-slate-100 py-4">
        <CardContent className="flex flex-row gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={seller.profile}></AvatarImage>
            <AvatarFallback className="rounded-full bg-primary-100 text-2xl font-semibold">{seller.nickname[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 justify-center">
            <span className="flex gap-1 font-semibold items-center">{seller.nickname}
              <Shield className="w-5 h-5 text-primary-500 font-bold" />
            </span>
            <span className="text-sm">완료한 거래 : {seller.completed_trade}</span>
          </div>
          <span className="flex items-center gap-2">
            <Star className="fill-yellow-300 text-yellow-300 size-5" />
            <span className="text-sm">{seller.rating}</span>
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
