import ItemDetail from "@/components/item/item-detail";
import { mockItems } from "@/lib/mock/mock-items";
import { notFound } from "next/navigation";



export default async function ItemDetailPage({
  params,
}: {
  params: { slug: string; };
}) {
  const item = mockItems.find((i) => i.id === params.slug);

  if (!item) {
    notFound();
  }

  return (
    <ItemDetail />
  );
}

