import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/customInput";
import { SignupStepProps } from "@/types/signup.props";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";



export default function SignupUserNickname({ goNextStep, initialData, handlePrevStep }: SignupStepProps) {

  const [nickname, setNickname] = useState(initialData.nickname || "");
  const [imageUrl, setImageUrl] = useState<string | null>(initialData.profileImage || null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isNicknameTouched, setIsNicknameTouched] = useState(false);


  const validateNickname = (input: string): string | null => {
    if (!input.trim()) {
      return '닉네임을 입력해주세요';
    }
    //  tqh 닉네임 정책 확인 후 재구성
    if (input.length < 2 || input.length > 12) {
      return '닉네임은 2자 이상, 12자 이하로 입력해주세요';
    }
    // tqh 추가 예정
    return null;
  };

  const checkNicknameAvailability = useCallback(async () => {
    setIsNicknameChecked(false);

    const clientError = validateNickname(nickname);
    if (clientError) {
      setNicknameError(clientError);
      return;
    }

    setIsCheckingNickname(true);
    setNicknameError(null);

    // tqh : 백엔드 연결
    try {
      // 
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNicknameError(null);
      setIsNicknameChecked(true);
    } catch (error) {

    } finally {
      setIsCheckingNickname(false);
    }
  }, [nickname]);

  useEffect(() => {
    if (isNicknameTouched) {
      const clientError = validateNickname(nickname);
      setNicknameError(clientError);
    }
    setIsNicknameChecked(false);
  }, [nickname, isNicknameTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 닉네임 검사 프론트 로직 실행 및 닉네임 검사 백엔드 로직 실행
    // 프론트 : 공백 검사, 글자수 검사
    // 백엔드 호출 로직 필요 tqh 
    const clientError = validateNickname(nickname);
    if (clientError) {
      setNicknameError(clientError);
      return;
    }

    if (!isNicknameChecked) {
      return;
    }

    if (nicknameError) {

      return;
    }

    goNextStep({ nickname, profileImage: imageUrl });
  };

  return (
    <>
      {/* 프로필 이미지 추가는 나중에 tqh */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex justify-center items-center h-32 w-32 rounded-full bg-gray-200 mx-auto mb-6 relative ">
          {imageUrl ? (
            <Image src={imageUrl} alt="Profile" className="w-full h-full object-cover rounded-full" width={128} height={128} />
          ) : (
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24" data-testid="profile-image-placeholder">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
          <Button
            type="button"
            data-testid='profile-image-upload-button'
            className="absolute bottom-0 right-0 p-3 bg-primary rounded-full text-white hover:bg-primary-600 transition-colors z-10"
            onClick={() => {
              setImageUrl('https://http.cat/images/100.jpg');
              alert('tqh : 추가 예정입니다.');
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.848-1.554A2 2 0 019.236 4h5.528a2 2 0 011.664.89l.848 1.554A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            name="nickname"
            placeholder="닉네임 (2~12자)"
            value={nickname}
            onChange={(e) => {
              setIsNicknameTouched(true);
              setNickname(e.target.value);
            }}
            className={`flex-grow h-14 text-base bg-gray-100 border-0 rounded-2xl px-6 ${nicknameError ? 'border-red-500 focus:border-red-500' : ''}`}
            required
            autoComplete="off"
          />
          <Button
            type="button" // form submit 방지를 위해 type="button"
            onClick={checkNicknameAvailability}
            className="h-14 bg-primary hover:bg-primary-600 text-white font-semibold text-base rounded-2xl px-4"
            disabled={!!nicknameError || isCheckingNickname || nickname.length < 2 || nickname.length > 12} // 유효성 검사 통과 및 로딩 상태에 따라 비활성화
          >
            {isCheckingNickname ? "확인 중..." : "중복확인"}
          </Button>
        </div>

        {nicknameError && isNicknameTouched && (
          <p className="pl-2 text-red-500 text-sm mt-1">{nicknameError}</p>
        )}
        {isCheckingNickname && (
          <p className="pl-2 text-gray-500 text-sm mt-1">닉네임 중복 확인 중...</p>
        )}
        {!nicknameError && isNicknameChecked && !isCheckingNickname && isNicknameTouched && (
          <p className="pl-2 text-green-500 text-sm mt-1">사용 가능한 닉네임입니다!</p>
        )}
        <Button
          type="submit"
          className="w-full h-14 bg-primary  hover:bg-primary-600 text-white font-semibold text-base rounded-2xl mt-8"
          disabled={!!nicknameError || isCheckingNickname || !isNicknameChecked}
        >
          다음으로
        </Button>
      </form >
    </>);
}