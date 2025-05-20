# Block Chain

해당 디렉토리는 `Re-Use` 프로젝트의 블록체인(스마트 컨트랙트) 관련 코드를 관리합니다.

에스크로 시스템 및 토큰 발행을 위한 솔리디티(Solidity) 스마트 컨트랙트와 Hardhat 기반의 개발, 배포 환경을 포함합니다.

## 프로젝트 구성

## 개발 환경 설정 

이 프로젝트는 Hardhat을 개발 환경으로 사용합니다.

### 요구 사항

- Node.js (LTS 사용 권장) 
- VScode Hardhat extension( Solidity ) - (사용 권장) 

### 설정

#### 간편 설정
```bash
npm install 
npx hardhat

```

#### 수동 설정

1. **블록체인 디렉토리 이동**

    ```bash
    cd ~/ReUse/BlockChain
    ```

2. **Hardhat 프로젝트 초기화**

    Hardhat을 설치한 후, Hardhat 프로젝트 구조를 생성합니다.
    ```bash
    npx hardhat
    ```
3. **OpenZeppelin Contracts 설치**
    
    솔리디티 컨트랙트에 상속받아 사용하는 `OpenZeppelin` 표준 라이브러리를 설치합니다.
    
    
4. **컨트랙트 파일 배치**

5. **Hardhat 설정 파일 확인**

### 사용방법

1. **컨트랙트 컴파일**

    솔리디티 컨트랙트를 컴파일하여 ABI(Application Binary Interface)와 바이트코드(bytecode)를 생성합니다.
    ```bash
    npx hardhat compile
    ```

2. **로컬 개발 블록체인 활용**

    컨트랙트를 테스트하고 배포하기 위한 임시 로컬 블록체인 네트워크를 시작합니다.
    **새로운 터미널 탭/창에서 실행해야 합니다.**
    ```bash
    npx hardhat node
    ```
3. **컨트랙트 배포**

    `scripts/deploy.js` 스크립트를 사용하여 컨트랙트를 Hardhat Network (또는 다른 네트워크)에 배포합니다.
    ```bash
    npx hardhat run scripts/deploy.js --network localhost #로컬
    npx hardhat run scripts/deploy.js --network <사용하려는 네트워크> # 특정 네트워크 배포
    ```
    (로컬 사용시 `hardhat node`가 실행 중인 상태에서 실행해야 합니다.)
    
4. **컨트랙트 테스트**


