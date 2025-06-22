"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const RAON_BASE = process.env.NEXT_PUBLIC_RAON_URL!;
  const RAON_API = process.env.NEXT_PUBLIC_RAON_API_URL!;
  
  useEffect(() => {
    const loadScripts = async () => {
      if ((window as any).OACX) return;

      const loadScript = (src: string) =>
        new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.defer = true;
          script.onload = () => resolve();
          script.onerror = () => reject(`Failed to load: ${src}`);
          document.body.appendChild(script);
        });

      const loadCss = () => {
        if (!document.getElementById("oacx-css")) {
          const link = document.createElement("link");
          link.id = "oacx-css";
          link.rel = "stylesheet";
          link.href = RAON_BASE + "oacx-ux.css";
          document.head.appendChild(link);
        }
      };

      loadCss();
      await loadScript(RAON_BASE + "oacx-vendor.js");
      await loadScript(RAON_BASE + "oacx-ux.js");
    };

    const startAuth = async () => {
      try {
        setLoading(true);
        await loadScripts();

        const OACX = (window as any).OACX;
        const config = {
          contentInfo: { signType: "ENT_MID" },
          compareCI: false,
          isBirth: true,
        };

        OACX.LOAD_MODULE(
          RAON_BASE + "config/config.mid.json",
          config,
          (res: any) => {
            const parsed = JSON.parse(res);
            console.log("[인증 응답]", parsed);
            // 이후 로직에 따라 VC 요청 등 처리
            // router.push("/auth/result",); // 인증 후 리디렉션
          }
        );
      } catch (e) {
        console.error("인증 오류:", e);
        alert("인증 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    startAuth();
  }, [RAON_BASE, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#AF52DE] to-[#FF2D92] text-white">
      <div id="oacxDiv" />
      {loading && <p className="text-center text-2xl">인증 준비 중입니다...</p>}
    </div>
  );
}
