
import { NextRequest, NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(req: NextRequest) {
  try {
    const { key, value } = await req.json();

    if (!key || !value) {
      return NextResponse.json({ message: '키와 값은 필수입니다.' }, { status: 400 });
    }

    // Redis에 데이터 저장: 키(key)에 값(value)을 저장하고 600초 후 만료 (SETEX 명령어)
    // SETEX는 SET + EXPIRE의 조합으로, 값 설정과 동시에 만료 시간 설정이 가능
    await redis.setex(key, 600, value); // 60초(1분) 후 데이터 자동 삭제

    return NextResponse.json({ message: `데이터 '${key}'가 Redis에 성공적으로 저장되었습니다.` }, { status: 200 });

  } catch (error) {
    console.error('Redis 데이터 저장 중 오류 발생:', error);
    return NextResponse.json({ message: '데이터 저장 중 서버 오류 발생' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ message: '조회할 키는 필수입니다.' }, { status: 400 });
    }

    // Redis에서 데이터 조회: GET 명령어
    const value = await redis.get(key);

    if (value === null) {
      // Redis에 해당 키의 데이터가 없거나 이미 만료되었을 경우
      return NextResponse.json({ message: `키 '${key}'에 해당하는 데이터를 찾을 수 없거나 만료되었습니다.` }, { status: 404 });
    }

    return NextResponse.json({ key, value }, { status: 200 });

  } catch (error) {
    console.error('Redis 데이터 조회 중 오류 발생:', error);
    return NextResponse.json({ message: '데이터 조회 중 서버 오류 발생' }, { status: 500 });
  }
}