import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import ProductCategory from "@/components/product/product-category";

export default function ProductMainPage() {


  return (
    <div className="min-h-screen bg-white pb-20">
      <AppHeader />
      <ProductCategory />
      <BottomNavigation />
    </div>
  );
}