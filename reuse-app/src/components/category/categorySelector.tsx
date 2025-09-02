"use client";

import { CATEGORIES, ECategory } from "@/lib/constants";
import type { ICategory } from "@/types/common";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from '@/components/ui/button';
import { Check } from "lucide-react";

interface ICategorySelectorProps {
  selectedCategories: ECategory[];
  onSelectionChange: (categories: ECategory[]) => void;
  mode: "create" | "update";
  minSelection?: number;
  maxSelection?: number;
  title?: string;
  // description?: string
  showCounter?: boolean;
}

export default function CategorySelector({
  selectedCategories,
  onSelectionChange,
  mode,
  minSelection = 1, // tqh : 1 개 필수면 1개로 수정
  maxSelection = 3,
  title,
  // description
  showCounter
}: ICategorySelectorProps) {

  const [categories] = useState<ICategory[]>(CATEGORIES);

  const toggleCategory = (categoryId: ECategory) => { // 카테고리 토글
    const isSelected = selectedCategories.includes(categoryId);

    if (isSelected) {
      // 선택 해제
      if (selectedCategories.length > minSelection) {
        onSelectionChange(selectedCategories.filter((id) => id !== categoryId));
      }
    } else {
      // 선택 추가
      if (selectedCategories.length < maxSelection) {
        onSelectionChange([...selectedCategories, categoryId]);
      }
    }
  };

  const isSelectionValid = selectedCategories.length >= minSelection && selectedCategories.length <= maxSelection;

  return (
    <div>

      <div className="text-center space-y-2 pt-4 mb-3 text-gray-700">
        <p className="text-lg font-bold">선호 카테고리를 선택해주세요</p>
      </div>
      {/* 선택된 카테고리 수 */}
      {showCounter && (
        <div className="flex items-center justify-between p-2 px-6">
          <span className="text-sm text-ios-gray">선택된 카테고리</span>
          <Badge variant={isSelectionValid ? "default" : "secondary"}>
            {selectedCategories.length} / {maxSelection}
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 p-6">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          const canSelect = selectedCategories.length < maxSelection || isSelected;
          const canDeselect = selectedCategories.length > minSelection || !isSelected;

          return (
            <Button
              key={category.id}
              variant={"ghost"}
              onClick={() => toggleCategory(category.id)}
              disabled={!canSelect || !canDeselect}
              className={`
                h-auto p-4 flex flex-col items-center space-y-2 border-2 transition-all
                ${isSelected
                  ? "border-ios-blue bg-blue-100 text-ios-blue"
                  : "border-ios-gray4 bg-white hover:border-ios-gray3"
                }
                ${!canSelect && !isSelected ? "opacity-50" : ""}
                `}
            >
              <div className="relative">
                <span className="text-2xl">{category.icon}</span>
                {isSelected &&
                  <span
                    className="absolute -top-1 -right-2 w-5 h-5 bg-ios-blue rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                }
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{category.name}</p>
              </div>
            </Button>
          );
        })}
      </div>
      <div className="text-center">
        <p className="text-xs text-ios-gray mb-2">
          {`최소 ${minSelection}개, 최대 ${maxSelection}개까지 선택 가능합니다`}
        </p>
        <p className="text-xs text-ios-gray">선택을 변경하여 맞춤 추천을 받아보세요</p>
      </div>
    </div >
  );
}

// 유저 정보 스토어에서 불러오기.
// 이미 체크되어있는 유저의 선호 카테고리 미리 적용하기.
// 로딩