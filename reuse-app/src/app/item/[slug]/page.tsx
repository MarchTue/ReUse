import ProductDetail from "@/components/product/productDetail";
import ProductHeader from "@/components/product/productHeader";
import ProductImages from "@/components/product/productImages";
import { mockProductDetails } from "@/lib/mock/mock-item-details";
import { mockProducts } from "@/lib/mock/mock-items";
import { notFound } from "next/navigation";



export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string; };
}) {
  // const product = mockProducts.find((i) => i.id === params.slug);
  const productTotal = mockProductDetails.find((i) => i.product.id === params.slug);

  if (!productTotal) return <div className="p-6">상품을 찾을 수 없습니다.</div>;

  const product = productTotal.product;
  console.log(product);


  return (
    <div className="min-h-screen bg-white">
      <ProductHeader title={product.title} />
      <ProductImages title={product.title} images={product.images} views={product.views} />
      <ProductDetail />
    </div>
  );
}

