// components/VerificationPage.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import nextClient from "@/utils/nextApiClient";

export default function VerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const RAON_BASE = process.env.NEXT_PUBLIC_RAON_URL!;

  useEffect(() => {
    const loadScripts = async () => {
      // 이미 로드된 경우 스크립트 다시 로드 방지
      if ((window as any).OACX) return true;

      const scriptPromises: Promise<void>[] = [];
      const loadScript = (src: string) =>
        new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.defer = true;
          script.id = `raon-script-${src.split('/').pop()?.split('.').shift()}`;
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
      scriptPromises.push(loadScript(RAON_BASE + "oacx-vendor.js"));
      scriptPromises.push(loadScript(RAON_BASE + "oacx-ux.js"));

      await Promise.all(scriptPromises); // 모든 스크립트 로드 대기
      return false;
    };

    const startAuth = async () => {
      try {
        setLoading(true);
        const scriptsAlreadyLoaded = await loadScripts();
        if (scriptsAlreadyLoaded && !(window as any).OACX) {
          console.error("OACX 객체가 로드되지 않았습니다. RAON Secure 스크립트 로드 실패.");
          throw new Error("RAON Secure 인증 모듈 로드 실패");
        }


        const OACX = (window as any).OACX;
        const config = {
          contentInfo: { signType: "ENT_MID" },
          compareCI: false,
          isBirth: true,
        };

        await new Promise<void>((resolve, reject) => {
          OACX.LOAD_MODULE(
            RAON_BASE + "config/config.mid.json",
            config,
            async (res: any) => {
              let parsed;
              try {
                parsed = JSON.parse(res);
                const parsedToken = await nextClient.postNext(
                  '/auth/raonParse',
                  { token: parsed.token }
                );

                const ciValue = parsedToken.data.ci;

                if (!ciValue) {
                  console.error("RAON 인증 응답에서 CI 값을 찾을 수 없습니다:", parsed);
                  alert("인증에 실패했습니다. (CI 값 없음)");
                  return reject(new Error("CI value not found in authentication response."));
                }
                const nextResponse = await nextClient.postNext(
                  '/auth/hashCi',
                  { ciValue: ciValue } // CI 값을 요청 본문에 포함
                );
                // 백엔드 검증 혹은 유저 확인
                const hashedCi = nextResponse.data.hashedCi;
                // 검사 결과에 따른 다음 리디렉션

                // 인증 및 해싱 성공 후 리디렉션
                // router.push("/auth/result");
                resolve();
              } catch (parseError) {
                console.error("RAON 응답 파싱 오류 또는 CI 해싱 API 호출 오류:", parseError);
                alert("인증 처리 중 오류가 발생했습니다.");
                reject(parseError);
              }
            },
            (err: any) => {
              console.error("[인증 실패 응답]", err);
              alert("인증에 실패했습니다.");
              reject(err);
            }
          );
        });
      } catch (e) {
        console.error("인증 준비 또는 초기화 오류:", e);
        alert("인증 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
        removeRaonScriptsAndCss();
      }
    };

    const removeRaonScriptsAndCss = () => {
      // CSS 제거
      const cssLink = document.getElementById("oacx-css");
      if (cssLink && cssLink.parentNode) {
        cssLink.parentNode.removeChild(cssLink);
      }

      // 스크립트 제거 (로드 시 부여했던 ID 사용)
      const vendorScript = document.getElementById("raon-script-oacx-vendor");
      if (vendorScript && vendorScript.parentNode) {
        vendorScript.parentNode.removeChild(vendorScript);
      }
      const uxScript = document.getElementById("raon-script-oacx-ux");
      if (uxScript && uxScript.parentNode) {
        uxScript.parentNode.removeChild(uxScript);
      }

      // window 객체에서 OACX 객체 정리 (메모리 누수 방지)
      if ((window as any).OACX) {
        delete (window as any).OACX;
      }
    };


    startAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [RAON_BASE]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#AF52DE] to-[#FF2D92] text-white">
      <div id="oacxDiv" />
      {loading && <p className="text-center text-2xl">인증 준비 중입니다...</p>}
    </div>
  );
}