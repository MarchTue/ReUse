## 0.5.0 (2025-08-27)

### ✨ Features

- CurrentToken, Menus, UserProfile 컴포넌트에 대한 테스트 추가 [#43](https://github.com/MarchTue/ReUse/issues/43) (d7cf3b6)
- 메뉴 항목에 라우트 추가 및 링크 컴포넌트 적용 [#43](https://github.com/MarchTue/ReUse/issues/43) (81dd151)
- 메뉴 컴포넌트 추가 및 하단 내비게이션 배경색 수정 [#43](https://github.com/MarchTue/ReUse/issues/43) (9bab8c0)
- 메뉴 구성 및 아이콘 매핑 추가 [#43](https://github.com/MarchTue/ReUse/issues/43) (47e556b)
- 마이페이지 유저 토큰, 유저 프로필 퍼블리싱 [#43](https://github.com/MarchTue/ReUse/issues/43) (399e8ce)
- Add new 96x96 PNG icon for the application [#74](https://github.com/MarchTue/ReUse/issues/74) (6180049)
- 마이페이지 퍼블리싱 - 헤더 - 프로필 - 보유중인 토큰 (작업중) [#43](https://github.com/MarchTue/ReUse/issues/43) (36b115b)
- README 및 릴리즈 스크립트 추가, CHANGELOG 자동화 기능 구현 [#55](https://github.com/MarchTue/ReUse/issues/55) (8ac513c)
- README 및 릴리즈 스크립트 추가, CHANGELOG 자동화 기능 구현 [#55](https://github.com/MarchTue/ReUse/issues/55) (ad23e5b)

### 🧹 Chores

- Add missing 'dev-local' script in package.json [#74](https://github.com/MarchTue/ReUse/issues/74) (d420d21)

### 📚 Documentation

- Release 0.5.0 preparation [#43](https://github.com/MarchTue/ReUse/issues/43) (2209fb3)

# Changelog

All notable changes to this project will be documented in this file.

## 0.4.1 (2025-07-19)

### ✨ Features

- add .versionrc.js for changelog configuration and remove CHANGELOG.md [#55](https://github.com/MarchTue/ReUse/issues/55) (5ae214a)
- BottomNavigation 컴포넌트에 대한 테스트 추가 [#41](https://github.com/MarchTue/ReUse/issues/41) (3cf2552)
- 바텀 내비게이션 컴포넌트 추가 및 네비게이션 탭 상수 정의 [#41](https://github.com/MarchTue/ReUse/issues/41) (b8ab181)
- AppHeader 컴포넌트에 대한 테스트 추가 [#41](https://github.com/MarchTue/ReUse/issues/41) (3f6fe26)
- 앱 해더 컴포넌트 추가 [#41](https://github.com/MarchTue/ReUse/issues/41) (ceece05)
- 홈페이지 구조 변경 및 서버 데이터 함수 주석 추가 [#41](https://github.com/MarchTue/ReUse/issues/41) (e713c66)
- tailwind.config.ts에 grad 색상 추가 [#41](https://github.com/MarchTue/ReUse/issues/41) (7f99488)
- 회원가입 닉네임 컴포넌트의 타이머 관련 설정 추가 및 에러 메시지 개선 [#35](https://github.com/MarchTue/ReUse/issues/35) (377fbdb)
- 회원가입 닉네임 컴포넌트 테스트 추가 및 프로필 이미지 관련 수정 [#35](https://github.com/MarchTue/ReUse/issues/35) (81b5092)
- 테스트 설정 개선  jest.setup.ts에 React import 추가 mock 기능 확장, package.json에 test-watch-log 스크립트 추가 [#35](https://github.com/MarchTue/ReUse/issues/35) (06e74b4)
- 회원가입 약관 컴포넌트 및 테스트 추가, 상태 관리 개선 - 테스트 결과에 따른 코드 수정 : signupTerms - 타입 일부 변경. [#35](https://github.com/MarchTue/ReUse/issues/35) (5277621)
- Add testing configuration and dependencies [#35](https://github.com/MarchTue/ReUse/issues/35) (0e1f88a)
- 회원가입 API 라우트 추가 및 Mock 데이터 연동 [#35](https://github.com/MarchTue/ReUse/issues/35) (78db3fe)
- 회원가입 기능 개선 - 제출 처리 및 단계 전환 로직 추가 [#35](https://github.com/MarchTue/ReUse/issues/35) (dfe3b59)
- 회원가입 단계에서 계좌 선택 컴포넌트 추가 및 라우팅 개선 [#35](https://github.com/MarchTue/ReUse/issues/35) (6a4e709)
- 회원가입 계좌 선택 컴포넌트 및 팝오버 추가 [#35](https://github.com/MarchTue/ReUse/issues/35) (762cbbc)
- 은행 정보 타입 및 목록 추가 [#35](https://github.com/MarchTue/ReUse/issues/35) (68d1103)
- @radix-ui/react-popover 패키지 추가 [#35](https://github.com/MarchTue/ReUse/issues/35) (ddda66c)
- 회원가입 약관 동의 컴포넌트 추가 및 필수 약관 동의 기능 구현 [#35](https://github.com/MarchTue/ReUse/issues/35) (fbb158c)
- 회원가입 컴포넌트에 단계별 내비게이션 및 약관 동의 기능 추가 [#35](https://github.com/MarchTue/ReUse/issues/35) (2c56202)
- 추가 회원가입 데이터 및 약관 동의 정보 인터페이스 정의 [#35](https://github.com/MarchTue/ReUse/issues/35) (81e1bcc)
- 회원가입 닉네임 입력 및 중복 확인 기능 추가 및 화면 구현 [#35](https://github.com/MarchTue/ReUse/issues/35) (33f1e4b)
- 새로운 Input 컴포넌트 추가 및 기존 Input 컴포넌트 코드 스타일 수정 [#35](https://github.com/MarchTue/ReUse/issues/35) (c475f0b)
- 회원가입 페이지 및 클라이언트 컴포넌트 추가 [#35](https://github.com/MarchTue/ReUse/issues/35) (e9482af)
- RAON 인증 처리 및 신규 사용자 가입 확인 호출 로직 [#28](https://github.com/MarchTue/ReUse/issues/28) (4f3e60c)
- RAON 인증 로직 개선 및 유저 확인 API 통합 [#28](https://github.com/MarchTue/ReUse/issues/28) (4e88161)
- 사용자 관련 타입 및 enum 추가 [#28](https://github.com/MarchTue/ReUse/issues/28) (4ce89c2)
- Next route api -  Redis 데이터 저장 및 조회 기능 추가 [#28](https://github.com/MarchTue/ReUse/issues/28) (7d54357)
- Add Redis client implementation and update package.json [#28](https://github.com/MarchTue/ReUse/issues/28) (5130864)
- Add Docker configuration and update package.json scripts [#28](https://github.com/MarchTue/ReUse/issues/28) (b79e863)
- Refactor VerificationPage to enhance script loading and error handling [#21](https://github.com/MarchTue/ReUse/issues/21) (55e5762)
- Implement CI hashing and token parsing API endpoints [#21](https://github.com/MarchTue/ReUse/issues/21) (7a883e9)
- Add axios dependency and types for bcrypt [#21](https://github.com/MarchTue/ReUse/issues/21) (c02dc66)
- Remove VerificationPage component and update routing in OnboardingPage [#21](https://github.com/MarchTue/ReUse/issues/21) (b42b76e)
- Initialize versioning documentation and update OnboardingPage routing [#21](https://github.com/MarchTue/ReUse/issues/21) (d115261)
- Add VerificationPage component and useScript hook for script loading [#21](https://github.com/MarchTue/ReUse/issues/21) (2c01d82)
- OnboardingPage component [#21](https://github.com/MarchTue/ReUse/issues/21) (23218c8)
- Add AuthGuard component for authentication handling [#21](https://github.com/MarchTue/ReUse/issues/21) (01942bc)
- Refactor Button component: improve styling and clean up code structure [#21](https://github.com/MarchTue/ReUse/issues/21) (843edc0)
- setup Auth for onboarding + login [#21](https://github.com/MarchTue/ReUse/issues/21) (45cd962)
- Create App Manifest and apply [#16](https://github.com/MarchTue/ReUse/issues/16) (83d14f7)
- config goblas.css [#16](https://github.com/MarchTue/ReUse/issues/16) (ed1a06d)
- Add Theme Provider [#16](https://github.com/MarchTue/ReUse/issues/16) (6d9ee21)
- add default constants [#14](https://github.com/MarchTue/ReUse/issues/14) (2baf846)

### 🐛 Bug Fixes

- 회원가입 페이지에서 검색 파라미터의 key를 선택적으로 처리하도록 수정 및 홈 페이지 추가  회원 가입 단계에서 버튼 텍스트를 '회원 가입'으로 변경 [#35](https://github.com/MarchTue/ReUse/issues/35) (429463a)
- 코드 주석에 tqh 태그 추가 [#35](https://github.com/MarchTue/ReUse/issues/35) (76fadff)
- 수정된 WalletPlatformEnum의 대문자 표기법 적용 [#35](https://github.com/MarchTue/ReUse/issues/35) (f0bed5c)
- Remove user/.idea - add gitignore [#33](https://github.com/MarchTue/ReUse/issues/33) (2a7494b)
- Remove .idea from git [#33](https://github.com/MarchTue/ReUse/issues/33) (6de9cfe)
- Fix TailwindCss and globals.css [#21](https://github.com/MarchTue/ReUse/issues/21) (b75b0fe)
- Fix Tailwind-animate import [#16](https://github.com/MarchTue/ReUse/issues/16) (a40a11b)

### ♻️ Code Refactoring

- SignupUserNickname 컴포넌트의 props 타입 변경 및 인터페이스 분리 [#35](https://github.com/MarchTue/ReUse/issues/35) (a0e4afd)
- RAON 토큰 파싱 및 CI 해싱 API 리펙터링 [#28](https://github.com/MarchTue/ReUse/issues/28) (9b84502)

### 🎨 Styles

- 불필요한 주석 제거 [#28](https://github.com/MarchTue/ReUse/issues/28) (9053725)
- util.ts [#14](https://github.com/MarchTue/ReUse/issues/14) (1a852ae)

### 🧹 Chores

- remove unused Redis API routes [#28](https://github.com/MarchTue/ReUse/issues/28) (caadef7)
- uuid 패키지 추가 [#28](https://github.com/MarchTue/ReUse/issues/28) (f5328ce)

### 📚 Documentation

- Release 0.4.1 preparation [#55](https://github.com/MarchTue/ReUse/issues/55) (e1f3d8a)
- 버전 관리 문서 작성 - 버전 0.1과 0.2 문서 통합 - 버전 0.3 회원가입 문서 생성 - 버전 0.4.0  : 홈 화면 및 기본 컴포넌트 문서 생성 [#53](https://github.com/MarchTue/ReUse/issues/53) (cda63c9)
- README 및 version 파일 업데이트, 패키지 버전 0.4.0으로 변경 [#53](https://github.com/MarchTue/ReUse/issues/53) (7b0e030)
- change version log and rename file [#16](https://github.com/MarchTue/ReUse/issues/16) (a14e71b)
- Add version change log [#14](https://github.com/MarchTue/ReUse/issues/14) (e34f3de)
- update proposal document [#10](https://github.com/MarchTue/ReUse/issues/10) (9474357)
- update proposal document [#10](https://github.com/MarchTue/ReUse/issues/10) (af6ce2c)
- add proposal document [#6](https://github.com/MarchTue/ReUse/issues/6) (6fa92fe)
- edit proposal.md [#6](https://github.com/MarchTue/ReUse/issues/6) (c4ff4ff)
- replace image [#6](https://github.com/MarchTue/ReUse/issues/6) (5ece9f7)
- add proposal document [#6](https://github.com/MarchTue/ReUse/issues/6) (2032cf7)
