import Recommend from "@/components/home/recommend";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";


/*
// 서버에서 데이터를 가져올 함수
async function getFavouriteCategoryItems() {
  
}
// 
async function getRecentItems() {
  
}
*/

export default async function Home() {
  // 추후 가져올 아이템...

  return (
    <div className="min-h-screen bg-white">
      <AppHeader
      />
      {/* 추천 상품 */}
      <Recommend />
      {/* 카테고리 상품1 - client */}
      {/* 카테고리 상품2 - client */}
      {/* 카테고리 상품3 - client */}

      <BottomNavigation />
    </div>

  );
}