# Web3 Wallet + 웹 어셈블리

> feat. Rust

해당 프로젝트는 Rust를 통한 Web3 지갑 기능을 웹 어셈블리로 컴파일하여 웹 환경에서 사용하기 위한 라이브러리입니다.

## Packaging

**설치**

wasm-pack은 npm 또는 Cargo를 통해 전역으로 설치할 수 있습니다.
```
# npm을 통한 설치 (권장)

npm install -g wasm-pack

# Cargo를 통한 설치

cargo install wasm-pack
```

**WASM 모듈 빌드**

프로젝트 루트 디렉터리에서 다음 명령어를 실행하여 WASM 모듈을 빌드할 수 있습니다.

`wasm-pack`은 wasm을 사용하는데 필요한 js 바인딩 코드도 함께 생성합니다. 

```bash
# Nest.js React, Vue.js 등 번들러를 사용하는 환경을 위한 빌드
wasm-pack build --target bundler

# 일반적인 HTML 파일에서 <script> 태그를 활용하여 사용하는 경우
wasm-pack build --target web
```

## 프로젝트 마이그레이션 
1. WASM 모듈 가져오기

`wasm-pack build`를 통해 생성한 pkg 디렉터리를 Nest.js (외 프로젝트 파일)의 적절한 위치에 복사

> 일반적으로 `lib` `utils`와 같은 폴더를 권장합니다.

2. WASM 컴포넌트 생성

WASM은 브라우저에서만 실행되므로, WASM 모듈은 클라이언트 사이드에서만 로드되어야 합니다.

3. 페이지에 컴포넌트 추가.

> ssr: false 와 같은 옵션의 포함을 권장합니다.

