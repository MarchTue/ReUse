"use client";
import ItemTitleButton from "../item/item-title-button";

// 해당 카테고리를 불러와서 넣는거니까, 서버측 렌더도 될 듯
// X -> 해당 유저의 카테고리이므로, client
export default function Recommend() {
  const title = "추천 상품";
  return (
    <>
      <div>recommend</div>
      <ItemTitleButton title={title} />
    </>
  );
}
