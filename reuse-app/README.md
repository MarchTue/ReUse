
## Getting Started

First, run the development server:

```bash
npm run dev

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ✨ Release & Changelog (릴리즈 및 변경 기록)

본 프론트엔드 프로젝트는  자동화된 릴리즈 프로세스를 통해 버전을 관리합니다.

 각 릴리즈에 대한 상세 변경 내용은 [CHANGELOG.md](./CHANGELOG.md) 파일을 통해 확인 가능합니다.

### 릴리즈 프로세스 사용법

프로젝트 버전 범핑 및 `CHANGELOG.md` 업데이트는 전용 쉘 스크립트를 통해 자동화됩니다.

**사용법:**

```bash
# 새로운 릴리즈를 수행합니다.
# 첫 번째 인자는 릴리즈 타입 (major, minor, patch)
# 두 번째 인자는 이 릴리즈와 관련된 GitHub Issue 번호
npm run release <release_type> <issue_number>

```

**예시**

- 패치(Patch) 릴리즈: 버그 수정 또는 사소한 기능 개선 시 사용 (예: 1.0.0 -> 1.0.1)

```
npm run release patch 55
# (예시) - "[FE]Docs #55: Release 0.4.2 preparation" 커밋 및 CHANGELOG 업데이트
```

- 마이너(Minor) 릴리즈: 하위 호환성을 유지하는 새로운 기능 추가 시 사용 (예: 1.0.0 -> 1.1.0)

```
npm run release minor 60
# (예시) "[FE]Docs #60: Release 0.5.0 preparation" 커밋 및 CHANGELOG 업데이트
```

- 메이저(Major) 릴리즈: 하위 호환성을 깨는 큰 변경 사항 발생 시 사용 (예: 1.0.0 -> 2.0.0)

```
npm run release major 70
# (예시) "[FE]Docs #70: Release 1.0.0 preparation" 커밋 및 CHANGELOG 업데이트
```

## Version Log

여기서는 프로젝트의 주요 업데이트 및 변경사항을 확인할 수 있습니다. 

각 버전을 클릭하여 자세한 내용을 확인하세요.

[version 0.4.X : 홈 화면 및 핵심 내비게이션 구성](./doc/version_0.4.md)
[version 0.3.X : 회원가입 플로우 및 모바일 신분증 인증 구현 ](./doc/version_0.3.md)
[version 0.1.X ~ 0.2 : 프로젝트 초기화 및 온보딩 구현](./doc/version_0.1.md)

## Tech Stack
프레임워크: Next.js (App Router)

언어: TypeScript

스타일링: Tailwind CSS, shadcn/ui

UI 컴포넌트: Radix UI

상태 관리: Zustand

폼 관리: React Hook Form, Zod

날짜 처리: date-fns

테스팅: Jest, React Testing Library

PWA: next-pwa

기타 유틸리티: Lucide React, class-variance-authority, clsx, tailwind-merge