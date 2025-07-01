// app/api/internal/auth/process-raon-ci/route.ts
// 이 API는 RAON 토큰을 파싱하고 CI를 해싱하는 단일 책임을 가집니다.
// 클라이언트에서 직접 호출되는 것이 아니라, 다른 내부 API (예: /api/auth/verify)에서 서버-투-서버로 호출됩니다.

import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import axios from "axios";

export async function POST(req: NextRequest) { // 변경지점 1: 모든 로직이 이 함수 내부로 이동
  // 환경 변수 설정 및 검증
  const SALT_ROUNDS_RAW = process.env.HASH_SALT_ROUNDS;
  const RAON_API_URL = process.env.RAON_API_URL; 

  let SALT_ROUNDS: number;
  if (SALT_ROUNDS_RAW) {
    const parsedRounds = parseInt(SALT_ROUNDS_RAW, 10);
    if (!isNaN(parsedRounds) && parsedRounds >= 4 && parsedRounds <= 31) {
      SALT_ROUNDS = parsedRounds;
    } else {
      console.error("환경 변수 HASH_SALT_ROUNDS가 유효한 숫자 (4-31)가 아닙니다. 값:", SALT_ROUNDS_RAW);
      return NextResponse.json(
        { message: "Internal server error: HASH_SALT_ROUNDS is invalid." },
        { status: 500 }
      );
    }
  } else {
    console.error("환경 변수 HASH_SALT_ROUNDS가 설정되지 않았습니다.");
    return NextResponse.json(
      { message: "Internal server error: HASH_SALT_ROUNDS is not set." },
      { status: 500 }
    );
  }

  if (!RAON_API_URL) {
    console.error("환경 변수 RAON_API_URL이 설정되지 않았습니다.");
    return NextResponse.json(
      { message: "Internal server error: RAON_API_URL is not properly set." },
      { status: 500 }
    );
  }

  try {
    const { token } = await req.json(); 

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ message: 'Token is required for RAON processing.' }, { status: 400 });
    }

    const raonResponse = await axios.post(
      RAON_API_URL + 'token',
      { token }
    );

    const ciValue = raonResponse.data?.data?.ci;
    const parsedRaonData = raonResponse.data?.data;

    if (!ciValue || typeof ciValue !== 'string') {
      console.error("RAON 인증 응답에서 유효한 CI 값을 찾을 수 없습니다:", raonResponse.data);
      return NextResponse.json({ message: "RAON authentication failed: CI value not found." }, { status: 400 });
    }

    // 2. 추출된 CI 값을 서버 사이드에서 해싱
    const hashedCi = await bcrypt.hash(ciValue, SALT_ROUNDS);

    // 해싱된 CI 값과 RAON에서 파싱된 추가 데이터를 반환
    return NextResponse.json({ hashedCi, parsedRaonData }, { status: 200 });

  } catch (error) {
    console.error("Error in process-raon-ci API:", error);
    if (axios.isAxiosError(error)) {
        console.error("Axios Error Details (process-raon-ci):", error.response?.data || error.message);
    }
    return NextResponse.json({ message: "Internal server error during RAON CI processing." }, { status: 500 });
  }
}