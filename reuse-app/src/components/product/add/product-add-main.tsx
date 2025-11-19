"use client";
import SubHeader from "@/components/common/subHeader";
import { useState } from "react";

export default function ProductMain() {
  const [currentStep, setCurrentStep] = useState(1);


  return (
    <div>
      <SubHeader title="상품 등록" mode="sub" />
      ProductMain
    </div>
  );
}