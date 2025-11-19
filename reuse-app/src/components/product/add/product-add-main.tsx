"use client";
import SubHeader from "@/components/common/subHeader";
import { useState } from "react";
import { IProductForm } from "@/types/product";
import type { TProductState } from "@/types/product";
import ProductAddStep1 from "./product-add-step1";
import ProductAddStep2 from "./product-add-step2";
import ProductAddStep3 from "./product-add-step3";
import ProductAddPreview from "./product-add-preview";
import { useRouter } from "next/navigation";

// 폼
const initialFormData: IProductForm = {
  title: "",
  category: "",
  price: 0,
  images: [],
  content: "",
  is_direct: false,
  direct_address: "",
  is_parcel: false,
  product_state: "" as TProductState
};

export default function ProductMain() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<IProductForm>(initialFormData);
  const router = useRouter();
  /**
   * 폼 필드 변경 핸들러
   * @param name 변경할 필드의 이름
   * @param value 필드의 새로운 값
   */
  const handleFormChange = (
    name: keyof IProductForm,
    value: IProductForm[keyof IProductForm]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * 단계 이동 핸들러
   * @param stepNumber 이동할 단계의 번호
   */
  const goToStep = (stepNumber: number) => {
    console.log(formData);
    if (stepNumber >= 1 && stepNumber <= 4) {
      setCurrentStep(stepNumber);
    } else if (stepNumber === 1) {
      router.back();
    }
  };

  const handleSubmit = async () => {
    // api 호출 위임
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductAddStep1
            formData={formData}
            onNext={() => goToStep(2)}
            onChange={handleFormChange}

          />
        );
      case 2:
        return (
          <ProductAddStep2
            formData={formData}
            onNext={() => goToStep(3)}
            onPrev={() => goToStep(1)}
            onChange={handleFormChange}
          />
        );
      case 3:
        return (
          <ProductAddStep3
            formData={formData}
            onNext={() => goToStep(4)}
            onPrev={() => goToStep(2)}
            onChange={handleFormChange}
          />
        );
      case 4:
        return (
          <ProductAddPreview
            formData={formData}
            onNext={() => handleSubmit}
            onPrev={() => goToStep(3)}
          // onChange={handleFormChange}
          />
        );
      default:
        return <div>잘못된 단계입니다.</div>; // 별도 실패 컴포넌트 생성 후 대체
    }
  };

  return (
    <div>
      <SubHeader title="상품 등록" mode="sub" onBackClick={() => goToStep(currentStep - 1)} />

      <div className="flex justify-center p-4 space-x-5 border-b-2">
        {[1, 2, 3, 4].map((step) => (
          <span key={step}
            className={`w-10 h-10 rounded-full flex items-center justify-center  font-bold transition-colors ${currentStep === step
              ? "bg-ios-blue text-white"
              : "bg-gray-300 text-gray-500"
              }`}
          >
            {step}
          </span>
        ))}
      </div>
      <div className="p-4">
        {renderStepComponent()}
      </div>

    </div>
  );
}