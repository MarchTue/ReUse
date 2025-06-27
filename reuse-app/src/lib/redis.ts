
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error('REDIS_URL 환경 변수가 정의되지 않았습니다. .env 파일 또는 docker-compose를 확인하세요.');
}


// Redis 클라이언트 인스턴스를 전역적으로 관리
declare global {
  // TypeScript 환경에서 'global' 객체에 'redis' 속성을 추가하기 위한 선언
  var redis: Redis | undefined;
}

let redis: Redis;

if (!global.redis) {
  global.redis = new Redis(redisUrl);
}

//eslint-disable-next-line
redis = global.redis;

redis.on('connect', () => {
  console.log('성공적으로 Redis에 연결되었습니다.');
});

redis.on('error', (err) => {
  console.error('❌ Redis 연결 오류 발생:', err);
});

export default redis;