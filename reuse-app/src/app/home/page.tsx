"use client";

import Recommend from "@/components/home/recommend";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { mockCategories } from "@/lib/mock/mock-items";


/*
// 서버에서 데이터를 가져올 함수 -> 최신 20개
async function getFavouriteCategoryItems() {
  
}
// 
async function getRecentItems() {
  
}
*/
// 혹은 여기도 서버 사이드가 되어야 하나?  -> 좋아요로 인한 CSR 구조로.
export default async function Home() {
  // 추후 가져올 아이템... 

  // 유저 카테고리


  return (
    <div className="min-h-screen bg-white pb-20">
      <AppHeader />
      {/* 추천 상품  - ssr -> csr (09/02) */}
      <Recommend />

      {mockCategories.map((category) => (
        <Recommend category={category} />
      ))}

      {/* 카테고리 상품1 - client */}
      {/* 카테고리 상품2 - client */}
      {/* 카테고리 상품3 - client */}
      <BottomNavigation />
    </div>

  );
}