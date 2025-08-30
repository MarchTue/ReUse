"use client";
import CategorySelector from "@/components/category/categorySelector";
import SubHeader from "@/components/common/subHeader";


export default function CategoryEditPage() {

  return (
    <div>
      <SubHeader title={"선호 카테고리 설정"} />
      <CategorySelector
        selectedCategories={[]}
        onSelectionChange={() => { }}
        mode="update"
        showCounter={true}
      />
    </div>
  );
}