import { ProductAddProps } from "@/types/product";
import { getImageFromServer, uploadImage } from "@/lib/api/image";
import React, { useState } from "react";
import Image from "next/image";

export default function ProductAddStep2({ formData, onChange, onNext, onPrev }: ProductAddProps
) {
  // 최소 3장
  const [images, setImages] = useState();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length < 1) return;
    files.map(async (file: File) => await uploadImage(file));
  };
  return (
    <div>
      <h1>상품 사진 등록</h1>
      <div className="space-y-4">
        {/* 이미지 업로드 부분 */}
        <label className="block w-full border-2 border-dashed text-center">
          <input type="file" multiple onChange={handleFileChange} />

        </label>
      </div>

    </div>
  );
}
