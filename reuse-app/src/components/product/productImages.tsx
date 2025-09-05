"use client";
import { IProduct, IProductDetail } from "@/types/product";
import { useState } from "react";
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from '@/components/ui/button';


interface ProductImagesProps {
  title: string;
  images: string[];
  views?: number;
  className?: string;
}
export default function ProductImages({ title, images, className, views }: ProductImagesProps) {



  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  console.log(images.length);
  const nextImage = () => setCurrentImageIdx((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className={`relative ${className} pt-20 flex justify-center`}>
      <div className="aspect-square bg-gray-100 relative overflow-hidden w-[95%] h-full object-cover">
        <Image src={images[currentImageIdx]} fill={true} alt={`title ${currentImageIdx}`} />

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-2 w-10 h-10 rounded-full bg-black/20 text-white hover:bg-black:40"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-2 w-10 h-10 rounded-full bg-black/20 text-white hover:bg-black:40"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* 현재 이미지 idx */}
        <div className="absolute bottom-4 left-[45%] flex space-x-2">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIdx ? "bg-white" : "bg-white/50"
                }`}
            />
          ))}
        </div>
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center">
          <Eye className="w-4 h-4 mr-1" />
          {views}
        </div>
        {/* image div ends */}
      </div>
    </div >
  );
};
