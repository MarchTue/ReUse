import nextClient from "@/utils/nextApiClient";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import redis from "@/lib/redis";
import axios from "axios";
import { DefaultSignupDataType, DidTypeEnum, RaonData, } from '@/types/user';

export async function POST(req: NextRequest) {

  let hashedCi: string;
  let parsedRaonData: RaonData; // tqh

  try {
    const reqBody = await req.json();
    const raonToken = reqBody.token;

    if (!raonToken || typeof raonToken !== 'string') {
      return NextResponse.json({ message: 'RAON token is required' }, { status: 400 });
    }

    // raon 인증 후 토큰 파싱 & 해시값 생성
    const processResponse = await nextClient.postNext<{ token: string; }, { hashedCi: string, parsedRaonData: RaonData; }>(
      '/internal/auth/verify/raon-parse',
      { token: raonToken }
    );
    if (processResponse.status !== 200 || !processResponse.data.hashedCi) {
      console.error("내부 RAON CI 처리 API 응답 오류:", processResponse.data);
      return NextResponse.json({ message: "Failed to process RAON authentication internally." }, { status: processResponse.status || 500 });
    }

    hashedCi = processResponse.data.hashedCi;
    parsedRaonData = processResponse.data.parsedRaonData;
    // 해당 ci 해시값을 통한 백엔드 내 유저 검증
    const userExists = await checkUserExistenceInBackend(hashedCi);

    // 유저가 존재하는 경우 - 로그인 처리 후 홈으로 이동
    if (userExists) {
      return;
    } else {
      // 유저가 존재하지 않는 경우 
      const personalSignupKey = uuidv4();
      const signupData: DefaultSignupDataType = {
        ci_hs: hashedCi,
        did: parsedRaonData.userDid,
        did_type: parsedRaonData.title === '주민등록증' ? DidTypeEnum.RESIDENT : DidTypeEnum.DRIVER,
        name: parsedRaonData.name,
        phone: parsedRaonData.telno
      };
      await redis.setex(`signup:${personalSignupKey}`, 900, JSON.stringify(signupData));

      return NextResponse.json({
        success: true,
        message: "New User, proceed to signup",
        redirectPath: `/auth/signup?key=${personalSignupKey}`,
        userExists: false,
      }, { status: 200 });
    }
  } catch (error) {
    console.error("인증 처리 중 치명적인 오류 발생 :", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios Error Details (main verify flow):", error.response?.data || error.message);
    }
    return NextResponse.json({ message: "Internal Server Error during authentication process." }, { status: 500 });
  }
}


async function checkUserExistenceInBackend(hashedCI: string): Promise<boolean> {
  if (!hashedCI) {
    console.error("checkUserExistenceInBackend: hashedCI 값이 유효하지 않습니다.");
    return false;
  }

  // 추후 백엔드 연동 수정
  // try {
  // 
  // } catch (error) {
  // 
  // }

  return false;
}

