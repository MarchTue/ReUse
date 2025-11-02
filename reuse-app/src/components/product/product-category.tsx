import { ECategory, CATEGORIES } from "@/lib/constants";
import type { ICategory } from "@/types/common";
import { Button } from "../ui/button";
import Link from "next/link";

export default function ProductCategory() {


  return (
    <div>
      <h1 className="px-4 pt-4 pb-0 font-semibold text-xl">상품 카테고리 목록</h1>
      <div className="grid grid-cols-3 gap-3 p-6">
        {CATEGORIES.map((category) =>
          <Link
            key={category.id}
            href={`/products/${category.id}`}
            className="h-auto p-4 flex flex-col items-center space-y-2 border-2 rounded-md transition-all border-ios-blue hover:text-ios-blue hover:bg-blue-100"
          >
            <Button
              key={category.id}
              variant={"ghost"}
              className="w-full h-full p-0 flex flex-col items-center space-y-2"
            >
              <div className="relative">
                <span className="text-2xl">{category.icon}</span>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">{category.name}</p>
              </div>
            </Button>
          </Link>
        )

        }

      </div>
    </div>
  );
}