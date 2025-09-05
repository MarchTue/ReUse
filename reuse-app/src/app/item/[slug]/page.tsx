import ProductDetail from "@/components/product/productDetail";
import ProductHeader from "@/components/product/productHeader";
import { mockProducts } from "@/lib/mock/mock-items";
import { notFound } from "next/navigation";



export default async function ItemDetailPage({
  params,
}: {
  params: { slug: string; };
}) {
  const product = mockProducts.find((i) => i.id === params.slug);
  console.log(product);
  if (!product) return <div className="p-6">상품을 찾을 수 없습니다.</div>;


  return (
    <div className="min-h-screen bg-white">
      <ProductHeader title={product.title} />
      {/* <ItemImages product={product} /> */}
      <ProductDetail />
    </div>
  );
}

