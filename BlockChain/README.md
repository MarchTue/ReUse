# Block Chain

해당 디렉토리는 `Re-Use` 프로젝트의 블록체인(스마트 컨트랙트) 관련 코드를 관리합니다.

에스크로 시스템 및 토큰 발행을 위한 솔리디티(Solidity) 스마트 컨트랙트와 Hardhat 기반의 개발, 배포 환경을 포함합니다.

## 프로젝트 구성

`BlockChain` 디렉토리는 다음과 같은 구조로 이루어짐.

- `contracts/`

  - MyToken.sol: ERC-20 표준을 따르는 토큰 컨트랙트.
  - Escrow.sol: 에스크로 로직을 구현한 컨트랙트.

- ignition/modules/: Hardhat Ignition 배포 모듈 (.ts 파일)이 위치함.
  - MyToken.ts: MyToken 컨트랙트의 배포를 정의하는 모듈.
  - Escrow.v1.test.ts: 테스트 환경을 위한 Escrow 컨트랙트 배포 모듈.
  - Escrow.v1.ts: 실제 배포(테스트넷/메인넷) 환경을 위한 Escrow 컨트랙트 배포 모듈.

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

#### 1. **컨트랙트 컴파일**

솔리디티 컨트랙트를 컴파일하여 ABI(Application Binary Interface)와 바이트코드(bytecode)를 생성합니다.

```bash
npx hardhat compile
```

#### 2. **로컬 개발 블록체인 활용**

컨트랙트를 테스트하고 배포하기 위한 임시 로컬 블록체인 네트워크를 시작합니다.

**새로운 터미널 탭/창에서 실행해야 합니다.**

```bash
npx hardhat node
```

#### 3. **컨트랙트 배포**

1. 로컬 개발 / 테스트 배포

Re-Use 프로젝트에서는 테스트용과 실제 배포용 모듈을 별도 관리합니다.

```bash
npx hardhat ignition deploy ignition/modules/EscrowTestModule.ts --network localhost # EscrowTestModule 파일을 이용한 Ignition 배포 예시
```

> 로컬 사용시 `hardhat node`가 실행 중인 상태에서 실행해야 합니다.

2. 실제 네트워크 배포

> `Escrow.v1.ts` 를 사용하여 배포합니다.

- 해당 모듈은 `autoReleaseDelay`가 3일로 설정되어 있습니다.
- 오라클 계정 주소를 `.env` 파일의 환경 변수 `ORACLE_ACCOUNT_ADDRESS`를 추가해야합니다.
- 배포에 사용할 네트워크가 `hardhat.config.ts` 에 설정되어 있어야 합니다.

#### 4. **컨트랙트 테스트**

**1. Unit Test**

```bash
npx hardhat test # 모든 테스트
npx hardhat test test/%테스트파일명% # 특정 파일
```


**2. Integration Test`**

`npx hardhat node`와 `npx hardhat ignition deploy`를 통해 로컬에 배포된 실제 컨트랙트 시스템이 시나리오대로 작동하는지 테스트합니다.

