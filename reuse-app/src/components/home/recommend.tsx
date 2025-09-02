"use client";
import { mockItems } from "@/lib/mock/mock-items";
import ItemTitleButton from "../item/item-title-button";
import Image from 'next/image';
import ItemList from "../item/item-list";

// 해당 카테고리를 불러와서 넣는거니까, 서버측 렌더도 될 듯
// X -> 해당 유저의 카테고리이므로, client
export default function Recommend({ category = "추천 상품" }: { category?: string; }) {
  // const title = "추천 상품";
  const recommendedItems = mockItems.sort(() => 0.5 - Math.random()).slice(0, 5);

  return (
    <>
      {/* <div>recommend</div> */}
      {/* <ItemTitleButton title={title} /> */}
      <ItemList title={category} items={recommendedItems} categoryId="category ID" loading={false} />
    </>
  );
}
