"use client";

import React, { useCallback, useEffect, useState } from 'react';
import SignupUserNickname from './signupUserNickname';
import { AdditionalSignupDataType } from '@/types/user';
import { Button } from '@/components/ui/button';
import SignupTerms from './signupTerms';
import { useRouter } from 'next/navigation';

interface SignupClientComponentProps {
  initialKey: string;
}

export default function SignupClientComponent({ initialKey }: SignupClientComponentProps) {
  const router = useRouter();
  // 0 약관   // 1 닉네임 + 프로필  // 2 은행 선택

  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const initialHashStep = parseInt(window.location.hash.replace('#step', ''));
      const totalSteps = 3; // 약관(0), 닉네임(1), 계좌(2)
      if (!isNaN(initialHashStep) && initialHashStep >= 0 && initialHashStep < totalSteps) {
        return initialHashStep;
      }
    }
    return 0;
  });

  const [signupData, setSignupData] = useState<AdditionalSignupDataType>({
    nickname: '',
    profileImage: null,
    accountInfo: {
      bank: null,
      account: null
    },
    walletInfo: {
      address: null,
      type: null,
      platform: null
    },
    termsAgreements: {
      service: false,
      privacy: false,
      marketing: false
    }

  });

  const goNextStep = useCallback((data: Partial<AdditionalSignupDataType>) => {
    setSignupData((prev) => ({ ...prev, ...data }));
    setCurrentStep((cur) => {
      const newStep = cur + 1;
      const totalSteps = 3; // 약관, 닉네임, 계좌설정 + 성공 페이지
      if (newStep <= totalSteps) { // 마지막 단계까지만 history.pushState
        router.push(`#step${newStep}`);
      }
      return newStep;
    });

    // debug
    console.log("Updated signupData:", { ...signupData, ...data });
  }, [signupData, router]); // signupData, router - 최신 상태 반영

  const handlePrevStep = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {

      const state = e.state as { step?: number; };
      if (state && typeof state.step === 'number') {
        setCurrentStep(state.step);
      } else {
        setCurrentStep(0);
      }
    };
    window.addEventListener('popstate', handlePopState);

    if (typeof window !== 'undefined') {
      router.replace(`#step${currentStep}`);
    }

    if (router && typeof window !== 'undefined') {
      router.replace(`#step${currentStep}`);
    }
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


  const renderStepIndicator = () => {
    const steps = ['약관 동의', '프로필 설정', '계좌 설정'];
    return (
      <div className="flex justify-center items-center py-4 px-6 mt-1 bg-white border-b border-gray-200">
        {steps.map((label, index) => (
          <React.Fragment key={index}>
            <div className='flex flex-col justify-center items-center '>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold transition-colors duration-300
                  ${index === currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                {index + 1}
              </div>
              <p className={`text-xs pt-2 ${index === currentStep ? 'text-black' : 'text-gray-400'} `}>{label}</p>
            </div>
            {/* 가로선 */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-2" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };


  return (
    <div className='flex flex-col flex-1 min-h-screen'>
      <div className="flex items-center justify-between py-4 px-6 bg-white border-b border-gray-200">
        {currentStep > 0 && currentStep < 3 ? ( // 0단계(약관), 3단계(완료/최종)에서는 '뒤로가기' 숨김
          <Button
            type="button"
            onClick={handlePrevStep}
            className="p-2 bg-transparent hover:bg-gray-100 text-gray-600 rounded-full"
            aria-label="이전 단계로 돌아가기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </Button>
        ) : (
          <div className="w-6 h-6"></div>
        )}
        <h1 className="text-xl font-extrabold text-gray-900 text-center flex-grow">
          회원가입
        </h1>
        <div className="w-6 h-6"></div>
      </div>

      {renderStepIndicator()}

      <div className='flex-1 px-6 py-4 overflow-y-auto'>
        {currentStep === 0 && (
          <SignupTerms
            goNextStep={goNextStep}
            initialData={signupData || { service: false, privacy: false, marketing: false }}
          />
        )}
        {currentStep === 1 && (
          <SignupUserNickname
            goNextStep={goNextStep}
            initialData={signupData}
            handlePrevStep={handlePrevStep}
          />
        )}
        {currentStep === 2 && (
          // <SignupAccountSelection 
          //   goNextStep={goNextStep} 
          //   initialData={signupData.accountInfo || { bank: null, account: null }} 
          // />
          <></>
        )}
        {/* currentStep 3은 회원가입 완료/성공 페이지 */}
        {currentStep === 3 && (
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-green-600 mb-4">회원가입 완료!</h2>
            <p className="text-lg text-gray-700">성공적으로 회원가입이 완료되었습니다.</p>
            {/* 추후 메인 페이지로 이동 버튼 등 추가 */}
          </div>
        )}
      </div>
    </div>
  );
}