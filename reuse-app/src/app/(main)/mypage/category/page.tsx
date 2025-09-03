"use client";

import CategorySelector from "@/components/category/categorySelector";
import SubHeader from "@/components/common/subHeader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function CategoryEditPage() {
  const router = useRouter();


  return (
    <div>
      <SubHeader title={"선호 카테고리 설정"} />
      <CategorySelector
        selectedCategories={[]}
        onSelectionChange={() => { }}
        mode="update"
        showCounter={true}
      />
      <div className="pt-8 text-center">
        <Button className="w-2/3">저장하기</Button>

      </div>
    </div>
  );
}