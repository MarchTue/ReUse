import ItemDetail from "@/components/item/itemDetail";
import ItemHeader from "@/components/item/itemHeader";
import { mockItems } from "@/lib/mock/mock-items";
import { notFound } from "next/navigation";



export default async function ItemDetailPage({
  params,
}: {
  params: { slug: string; };
}) {
  const item = mockItems.find((i) => i.id === params.slug);
  console.log(item);
  if (!item) return <div className="p-6">상품을 찾을 수 없습니다.</div>;


  return (
    <div className="min-h-screen bg-white">
      <ItemHeader title={item.title} />
      <ItemDetail />
    </div>
  );
}

