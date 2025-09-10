import { IProduct } from "@/types/product";
import ItemTitleButton from "./product-title-button";
import Image from "next/image";
import { Card, CardContent } from '@/components/ui/card';
import Link from "next/link";


interface IProductList {
  title: string;
  products: IProduct[];
  categoryId?: string;
  loading?: boolean;
}

export default function ProductList({
  title,
  products,
  categoryId,
  loading
}: IProductList) {
  const tmpDate = new Date();

  return (
    <div className="px-4 mt-6 space-y-6">
      <ItemTitleButton title={title} categoryId={categoryId} />

      {loading ? (
        <p className="text-ios-gray">불러오는 중</p>
      ) : products.length === 0 ? (
        <p className="text-ios-gray">상품이 없습니다.</p>
      ) : (
        <div className="">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`} // slug 활용
            >
              <Card
                key={product.id}
                className="
              border rounded-lg p-2 hover:shadow-lg transition 
              my-4 pt-4 ml-0 pl-0
              "
              >
                <CardContent className="flex products-center justify-between pl-4">
                  <div className="relative w-2/5 min-h-[6rem] mb-2 rounded-md pl-0 ml-0">
                    <Image
                      src="/mock-item.png" alt={product.title} fill={true}
                      className="w-full"
                    />
                  </div>
                  <div className="flex-1 flex justify-center products-start flex-col pl-6">
                    <p className="text-lg font-semibold">{product.title}</p>
                    <p className="flex gap-2 text-lg font-semibold"> <Image src="/coin.png" width={24} height={18} alt="" />{product.price}</p>
                    {/* tqh 좋아요 여부 */}
                    {/* tqh 상품 상태 */}
                    {/* tqh 작성시간 - dayjs */}
                    <p className="text-ios-gray text-sm">{`${'0' + (tmpDate.getMonth() + 1)}/${tmpDate.getDate()} ${tmpDate.getHours()}:${tmpDate.getMinutes()}`}</p>
                  </div>

                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}