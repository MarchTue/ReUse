import { NextRequest, NextResponse } from "next/server"; // 변경지점 1: NextApiRequest, NextApiResponse 대신 NextRequest, NextResponse 임포트
import bcrypt from 'bcrypt';

export async function POST(
  req: NextRequest,
) {
  const SALT_ROUNDS_RAW = process.env.HASH_SALT_ROUNDS;
  let SALT_ROUNDS: number;

  if (SALT_ROUNDS_RAW) {
    const parsedRounds = parseInt(SALT_ROUNDS_RAW, 10);
    if (!isNaN(parsedRounds) && parsedRounds >= 4 && parsedRounds <= 31) {
      SALT_ROUNDS = parsedRounds;
    } else {
      console.error("환경 변수 HASH_SALT_ROUNDS가 유효한 숫자 (4-31)가 아닙니다. 값:", SALT_ROUNDS_RAW);
      return NextResponse.json(
        { message: "Server configuration error: HASH_SALT_ROUNDS is invalid." },
        { status: 500 }
      );
    }
  } else {
    console.error("환경 변수 HASH_SALT_ROUNDS가 설정되지 않았습니다.");
    return NextResponse.json(
      { message: "Server configuration error: HASH_SALT_ROUNDS is not set." },
      { status: 500 }
    );
  }

  let ciValue: string;
  try {
    const requestBody = await req.json();
    ciValue = requestBody.ciValue;
  } catch (parseError) {
    console.error("Failed to parse request body as JSON:", parseError);
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  if (!ciValue || typeof ciValue !== 'string') {
    return NextResponse.json({ message: "Invalid CI value provided" }, { status: 400 });
  }

  try {
    const hashedCi = await bcrypt.hash(ciValue, SALT_ROUNDS);
    return NextResponse.json({ hashedCi }, { status: 200 });
  } catch (error) {
    console.error("Error during CI hashing:", error);
    return NextResponse.json({ message: "Internal Server Error during hashing" }, { status: 500 });
  }
}