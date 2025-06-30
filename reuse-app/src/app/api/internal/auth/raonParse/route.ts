import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_RAON_API_URL;

export async function POST(
  req: NextRequest,
) {
  if (API_URL === undefined) {
    return NextResponse.json({ message: "Server configuration error: RAON_EXTERNAL_API_URL is not properly set." }, { status: 500 });
  }

  if (req.method !== "POST") {
    return NextResponse.json({ message: 'Method not Allowed' }, { status: 405 });
  }
  const parsedReq = await req.json();
  const token = parsedReq.token;

  if (!token) {
    return NextResponse.json({ message: 'Token is required.' }, { status: 400 });
  }

  try {
    const parsed = await axios.post(
      API_URL + 'token',
      {
        token
      }
    );
    return NextResponse.json(parsed.data.data, { status: 200 }); // 응답 데이터와 상태 코드 함께 반환
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error during token parsing." }, { status: 500 });
  }
}