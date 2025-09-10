"use client";

import { IProductDetail } from "@/types/product";
import { Badge } from "lucide-react";


export default function ProductDetail({ productProp }: { productProp: IProductDetail; }) {
  const { product } = productProp;
  return (
    <div className="px-6 py-6">
      <div className="mb-4">


        <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{product.title}</h1>
        <div className="text-primary-500 flex items-center space-x-3 mb-3 text-2xl font-semibold">{product.price}  RU</div>
        {/* 직거래시 직거래 장소 나올만한 곳 1 tqh */}
        <hr className="mb-4" />
        <div className="font-bold mb-2 ">상품 설명</div>
        <div className="text-bold">{product.content}</div>
      </div>
    </div>
  );
};
