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

      <BottomNavigation />
    </div>

  );
}