"use client";

import { Button } from "@/components/ui/button";

import { useAuthStore } from "@/store/auth";
import { useWalletStore } from "@/store/walletStore";
import { ArrowRight, Shield, ShoppingBag, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isChecking, setIsChecking] = useState(false); // 추후 개발 진행 후, 토큰 체크가 가능하다면, true로 변경

  // Zustand 상태 구독  
  const { isAuthenticated, token } = useAuthStore();
  const { address, isConnected, hasWalletData, isInitialized, initialize } = useWalletStore();

  const router = useRouter();

  const slides = [
    {
      icon: Shield,
      title: "Re-Use",
      subtitle: "안전한 중고거래",
      description: "DID 기반 신원 인증으로\n신뢰할 수 있는 거래환경을 제공합니다",
      bgColor: "from-[#007AFF] to-[#5856D6]",
    },
    {
      icon: Wallet,
      title: "DID 인증",
      subtitle: "블록체인 기반 신원인증",
      description: "탈중앙화 신원증명으로\n개인정보를 안전하게 보호합니다",
      bgColor: "from-[#5856D6] to-[#AF52DE]",
    },
    {
      icon: ShoppingBag,
      title: "투명한 거래",
      subtitle: "ERC-20 토큰 활용",
      description: "모든 거래내역이\n블록체인에 투명하게 기록됩니다",
      bgColor: "from-[#AF52DE] to-[#FF2D92]",
    },
  ];

  //  // 토큰 있으면 유효성 검사 후 메인 리다이렉트. - 추후 구현
  useEffect(() => {
    if (!isInitialized) {
      initialize();
      // auth 관련 로직도 이곳에 들어가야 한다. tqh
      return;
    }
    if (isAuthenticated || hasWalletData) {
      let redirectPath;

      if (isAuthenticated) {
        if (isConnected) { // 인증 + 지갑
          redirectPath = '/home';
        } else if (hasWalletData) { // 인증 + 데이터 있음 하지만 지갑 잠김
          redirectPath = "/wallet/unlock";
        } else {
          redirectPath = "/wallet/create-or-recover";
        }
      } else if (hasWalletData) {
        // 토큰 X but 지갑 있음 <- 이상상황 (인증 / 로그인 DID 인증) 필요
        redirectPath = "/auth/verification";
      } else {
        // 미인증 + wallet 없음
        setIsChecking(false);
        return;
      }
      console.log(`Router: Redirecting to ${redirectPath}`);
      router.replace(redirectPath);
      return;
    }
    setIsChecking(false);

  }, [isInitialized, isConnected, hasWalletData, isAuthenticated, initialize, router]);

  // 슬라이드 
  useEffect(() => {
    if (!isChecking) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [slides.length, isChecking]);




  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;
  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${currentSlideData.bgColor} flex flex-col text-white relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/20"></div>
        <div className="absolute top-40 right-8 w-24 h-24 rounded-full bg-white/10"></div>
        <div className="absolute bottom-32 left-6 w-20 h-20 rounded-full bg-white/15"></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 relative z-10">
        {/* Icon */}
        <div className="w-28 h-28 bg-white/20 rounded-3xl flex items-center justify-center mb-12 backdrop-blur-sm shadow-lg">
          <IconComponent className="w-14 h-14 text-white" />
        </div>

        {/* Text Content */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-3 text-white">{currentSlideData.title}</h1>
          <p className="text-xl font-medium mb-6 opacity-90">{currentSlideData.subtitle}</p>
          <p className="text-base leading-relaxed opacity-80 whitespace-pre-line">{currentSlideData.description}</p>
        </div>

        {/* Dots Indicator */}
        <div className="flex space-x-3 mb-16">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white scale-125" : "bg-white/40"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-8 pb-12 space-y-4 relative z-10">
        <Button
          onClick={() => router.push("auth/verification")}
          className="w-full h-14 bg-white text-gray-900 hover:bg-gray-100 font-semibold text-lg rounded-2xl shadow-lg"
        >
          시작하기
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}