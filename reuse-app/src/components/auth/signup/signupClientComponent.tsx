"use client";

import React, { useState } from 'react';
import SignupUserNickname from './signupUserNickname';
import { AdditionalSignupDataType } from '@/types/user';

interface SignupClientComponentProps {
  initialKey: string;
}

export default function SignupClientComponent({ initialKey }: SignupClientComponentProps) {
  // 0 약관   // 1 닉네임 + 프로필  // 2 은행 선택
  const [currentStep, setCurrentStep] = useState(0);

  const [signupData, setSignupData] = useState<AdditionalSignupDataType>({
    nickname: '',
    profileImage: '',
    accountInfo: {
      bank: null,
      account: null
    },
    walletInfo: {
      address: null,
      type: null,
      platform: null
    }
  });

  const goNextStep = (data: Partial<AdditionalSignupDataType>) => {
    setSignupData((prev) => ({ ...prev, ...data }));
    setCurrentStep((cur) => cur + 1);
    // debug
    console.log({ ...signupData, ...data });
  };
  const goPrevStep = (e) => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderStepIndicator = () => {
    const steps = ['약관 동의', '프로필 설정', '계좌 설정'];
    return (
      <div className="flex justify-center items-center py-4 px-6 bg-white border-b border-gray-200">
        {steps.map((label, index) => (
          <React.Fragment key={index}>
            <div className='flex flex-col justify-center items-center '>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold transition-colors duration-300
                  ${index === currentStep ? 'bg-primary  text-white' : 'bg-gray-200 text-gray-500'}`}
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
    <div className='flex flex-col flex-1'>
      {renderStepIndicator()}
      <div className='flex-1 px-6 py-4 overflow-y-auto'>

        {currentStep === 0 && (
          <SignupUserNickname onNextStep={goNextStep} initialData={signupData} />
        )}
        {currentStep === 1 && (
          <></>
        )}
        {currentStep === 2 && (
          <></>
        )}
      </div>
    </div>
  );
}