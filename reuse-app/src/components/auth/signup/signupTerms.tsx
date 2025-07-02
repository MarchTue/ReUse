"use client";


import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SignupStepProps } from "@/types/signup.props";
import { TermsAgreementData } from "@/types/user";
import { useEffect, useState } from "react";



export default function SignupTerms({ goNextStep, initialData }: SignupStepProps) {
  const termsInitialData = initialData as Partial<TermsAgreementData>;

  const [terms, setTerms] = useState<TermsAgreementData>({
    service: termsInitialData.service || false,
    privacy: termsInitialData.privacy || false,
    marketing: termsInitialData.marketing || false
  });

  const [allRequiredAgreed, setAllRequiredAgreed] = useState(false);

  // 필수 요소가 전부 동의되었는지 확인
  useEffect(() => {
    setAllRequiredAgreed(terms.service && terms.privacy);
  }, [terms]);

  const handleCheckboxChange = (termName: keyof TermsAgreementData, checked: boolean) => {
    setTerms(prevTerms => ({
      ...prevTerms,
      [termName]: checked
    }));
  };

  const handleAllAgreeChange = (checked: boolean) => {
    setTerms({
      service: checked,
      privacy: checked,
      marketing: checked,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!allRequiredAgreed) {
      alert("필수 약관에 모두 동의해야 다음 단계로 진행할 수 있습니다.");
      return;
    }

    goNextStep({ termsAgreements: terms });
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">서비스 약관 동의</h2>

        <div className="flex items-center space-x-2 border-b pb-4 mb-4">
          <Checkbox
            id="all-agree"
            checked={terms.service && terms.privacy && terms.marketing}
            onCheckedChange={handleAllAgreeChange}
          />
          <label htmlFor="all-agree" className="text-lg font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            모든 약관에 동의합니다
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="service-agree"
            checked={terms.service}
            onCheckedChange={(checked) => handleCheckboxChange("service", Boolean(checked))}
          />
          <label htmlFor="service-agree" className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            [필수] 서비스 이용 약관 <span className="text-blue-500 cursor-pointer text-sm ml-2">(자세히 보기)</span>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="privacy-agree"
            checked={terms.privacy}
            onCheckedChange={(checked) => handleCheckboxChange("privacy", Boolean(checked))}
          />
          <label htmlFor="privacy-agree" className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            [필수] 개인정보 수집 및 이용 동의 <span className="text-blue-500 cursor-pointer text-sm ml-2">(자세히 보기)</span>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="marketing-agree"
            checked={terms.marketing}
            onCheckedChange={(checked) => handleCheckboxChange("marketing", Boolean(checked))}
          />
          <label htmlFor="marketing-agree" className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            [선택] 마케팅 정보 수신 동의 <span className="text-blue-500 cursor-pointer text-sm ml-2">(자세히 보기)</span>
          </label>
        </div>

        <Button
          type="submit"
          className="w-full h-14 bg-primary hover:bg-primary-600 text-white font-semibold text-base rounded-2xl mt-8"
          disabled={!allRequiredAgreed}
        >
          다음으로
        </Button>
      </form>
    </>
  );

}