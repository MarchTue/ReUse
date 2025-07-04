import { NextRequest, NextResponse } from "next/server";
import { AdditionalSignupDataType } from '@/types/user';
import redis from "@/lib/redis";
import { MockSignupRes } from "@/__mocks__/signupMock";



export async function POST(req: NextRequest) {

  try {
    const reqBody = await req.json();

    const additionalSignupData: AdditionalSignupDataType = reqBody.finalData;
    const initialKey: string = reqBody.initialKey;

    const userInfo = await redis.get('signup:' + initialKey);

    if (!userInfo) {
      console.error('user info not found!');
      return NextResponse.json(
        { message: " userInfo not found" },
        { status: 404 }
      );
    }
    // tqh : 백엔드 연동
    //  const res = ... 
    const mockRes = MockSignupRes;
    return NextResponse.json(
      {
        ...mockRes,
      }
    );

  } catch (error) {

  }

}