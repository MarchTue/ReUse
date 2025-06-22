"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerificationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const RAON_BASE = process.env.NEXT_PUBLIC_RAON_URL!;
  const RAON_API = process.env.NEXT_PUBLIC_RAON_API_URL!;

  const handleAuthClick = async () => {
    setIsLoading(true);

    try {
      await loadRaonScriptsOnce();

      const OACX = (window as any).OACX;
      if (!OACX) {
        window.alert("OACX 로딩 실패");
        return;
      }

      const config = {
        contentInfo: { signType: "ENT_MID" },
        compareCI: false,
        isBirth: true,
      };

      OACX.LOAD_MODULE(
        RAON_BASE + "config/config.mid.json",
        config,
        function (res: any) {
          const parsed = JSON.parse(res);
          console.log("[인증 응답]", parsed);

          // TODO: 인증 결과 상태 관리에 저장하거나 API 호출 등
          router.push("/auth/result"); // 인증 성공 시 이동할 페이지
        }
      );
    } catch (e) {
      console.error("OACX 로딩 실패", e);
      window.alert("스크립트 로딩 중 오류 발생");
    } finally {
      setIsLoading(false);
      // CSS 제거 (필요한 경우만)
      const css = document.getElementById("oacx-css");
      if (css) {
        document.head.removeChild(css);
      }
    }
  };

  const loadRaonScriptsOnce = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).OACX) return resolve();

      // CSS 로딩
      if (!document.getElementById("oacx-css")) {
        const css = document.createElement("link");
        css.id = "oacx-css";
        css.rel = "stylesheet";
        css.href = RAON_BASE + "oacx-ux.css";
        document.head.appendChild(css);
      }

      // vendor.js 로딩 → 완료되면 ux.js 로딩
      const vendor = document.createElement("script");
      vendor.src = RAON_BASE + "oacx-vendor.js";
      vendor.defer = true;
      vendor.onload = () => {
        const ux = document.createElement("script");
        ux.src = RAON_BASE + "oacx-ux.js";
        ux.defer = true;
        ux.onload = () => resolve();
        ux.onerror = () => reject("UX 스크립트 로딩 실패");
        document.body.appendChild(ux);
      };
      vendor.onerror = () => reject("Vendor 스크립트 로딩 실패");
      document.body.appendChild(vendor);
    });
  };

  const pageInfo = {
    icon: Wallet,
    title: "DID 인증",
    subtitle: "블록체인 기반 신원인증",
    description: "탈중앙화 신원증명으로\n개인정보를 안전하게 보호합니다",
    bgColor: "from-[#5856D6] to-[#AF52DE]",
  };
  const IconComponent = pageInfo.icon;

  return (
    <>
      <div id="oacxDiv" className="z-[1000]" />
      <div
        className={`min-h-screen bg-gradient-to-b ${pageInfo.bgColor} flex flex-col text-white relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white/20"></div>
          <div className="absolute top-40 right-8 w-24 h-24 rounded-full bg-white/10"></div>
          <div className="absolute bottom-32 left-6 w-20 h-20 rounded-full bg-white/15"></div>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center px-8 relative z-10">
          <div className="w-28 h-28 bg-white/20 rounded-3xl flex items-center justify-center mb-12 backdrop-blur-sm shadow-lg">
            <IconComponent className="w-14 h-14 text-white" />
          </div>

          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-3 text-white">{pageInfo.title}</h1>
            <p className="text-xl font-medium mb-6 opacity-90">{pageInfo.subtitle}</p>
            <p className="text-base leading-relaxed opacity-80 whitespace-pre-line">{pageInfo.description}</p>
          </div>
        </div>

        <div className="px-8 pb-12 space-y-4 relative z-10">
          <Button
            onClick={handleAuthClick}
            className="w-full h-14 bg-white text-gray-900 hover:bg-gray-100 font-semibold text-lg rounded-2xl shadow-lg disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "로딩 중..." : "모바일 신분증 인증"}
          </Button>
        </div>
      </div>
    </>
  );
}