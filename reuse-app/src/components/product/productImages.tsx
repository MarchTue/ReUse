"use client";
import { IProduct, IProductDetail } from "@/types/product";
import { useState } from "react";


interface ProductImagesProps {
  product: IProductDetail;
  views: number;
  className?: string;
}
export default function ProductImages({ product, className, views }: ProductImagesProps) {

  const [currentImage, setCurrentImage] = useState(0);



  const nextImage = () => { };

  return (
    <div className={className}>
      <p>{product.product.id}</p>
    </div>
  );
};
