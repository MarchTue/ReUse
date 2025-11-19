import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";
import { ProductAddProps } from "@/types/product";

export default function ProductAddStep1({ formData, onNext, onChange }: ProductAddProps) {
  const handleSelectCategory = (categoryId: string) => {
    onChange("category", categoryId);
  };



  return (
    <div>
      <h1 className="px-4 pt-4 pb-0 font-semibold text-xl">
        1. 🏷️ 카테고리를 선택해주세요
      </h1>
      <div className="grid grid-cols-3 gap-3 p-6">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleSelectCategory(category.id)}
            className={`h-auto p-4 flex flex-col items-center space-y-2 border-2 rounded-md transition-all 
            ${formData.category === category.id
                ? "border-ios-blue bg-blue-50"
                : "border-gray-200 hover:border-ios-blue hover:text-ios-blue hover:bg-blue-100"
              }
          `}
          >
            <div className="relative">
              <span className="text-2xl">{category.icon}</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{category.name}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="p-6">
        <Button
          onClick={onNext}
          disabled={!formData.category} // 카테고리 선택 시에만 활성화
          className="w-full"
        >
          다음 단계
        </Button>
      </div>
    </div>
  );
}
