// 파일명: scripts/local.qa.ts
import { time } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';

async function main(): Promise<void> {
  console.log('Hardhat local network Test start');

  const signers: SignerWithAddress[] = await ethers.getSigners();
  const [deployer, client, seller, oracle, anotherUser] = signers;

  // 배포된 주소 (필요시 갱신)
  const MyTokenAddr = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
  const EscrowAddr = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

  const MyToken = await ethers.getContractAt("MyToken", MyTokenAddr);
  const Escrow = await ethers.getContractAt("Escrow", EscrowAddr);

  const escrowAmount = ethers.parseUnits("1000", 0);
  const proposalId = ethers.keccak256(ethers.toUtf8Bytes("qa-test-proposal-1"));
  const firstEscrowId = 1;

  console.log(`[1] 컨트랙트 로딩 성공`);
  console.log(` - MyToken 주소: ${MyToken.target}`);
  console.log(` - Escrow 주소: ${Escrow.target}\n`);

  console.log(`[2] 초기 설정`);
  await MyToken.connect(deployer).mint(client.address, escrowAmount);
  console.log(`클라이언트(${client.address})에게 ${ethers.formatUnits(escrowAmount, 0)} 토큰 발행`);
  await Escrow.connect(deployer).grantOracleRole(oracle.address);
  console.log(`오라클(${oracle.address})에게 권한 부여\n`);

  console.log(`[3] permit 서명 생성 및 에스크로 생성`);
  const deadlineSec = Math.floor(Date.now() / 1000) + 3600; // 1시간 뒤 만료 (seconds)
  const nonce = await MyToken.nonces(client.address);
  console.log(nonce, 'asasdhjasdjkhasdhjkasdhjkasdhjk');
  const name = await MyToken.name();
  const version = "1";
  const chainId = (await ethers.provider.getNetwork()).chainId;

  // EIP-712 Domain 
  const domain = {
    name,
    version,
    chainId,
    verifyingContract: MyToken.target as string, // <- 타입 충돌 방지
  } as const;

  // EIP-712 Types
  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" }
    ]
  };

  // EIP-712 Message
  const message = {
    owner: client.address,
    spender: Escrow.target as string,
    value: escrowAmount,
    nonce,
    deadline: ethers.toBigInt(deadlineSec),
  } as const;

  const signature = await client.signTypedData(domain, types, message);
  const parsed = ethers.Signature.from(signature);

  // v 값 보정 (0/1 -> 27/28)
  const v: number = parsed.v >= 27 ? parsed.v : parsed.v + 27;
  const r: `0x${string}` = parsed.r as `0x${string}`; // bytes32
  const s: `0x${string}` = parsed.s as `0x${string}`; // bytes32

  //    (_buyer, _seller, _amount, _tokenAddress, _permitValue, _deadline, _v, _r, _s, _proposalId)
  const depositTx = await Escrow.connect(client).deposit(
    client.address,                 // _buyer
    seller.address,                 // _seller
    escrowAmount,                   // _amount
    MyToken.target as string,       // _tokenAddress
    escrowAmount,                   // _permitValue (permit로 승인할 금액 = 예치 금액)
    ethers.toBigInt(deadlineSec),   // _deadline
    v,                              // _v (uint8)
    r,                              // _r (bytes32)
    s,                              // _s (bytes32)
    proposalId                      // _proposalId (bytes32)
  );
  await depositTx.wait();

  const escrowCreated = await Escrow.escrows(firstEscrowId);
  console.log(`에스크로 ID ${firstEscrowId} 생성 완료. 현재 상태: ${escrowCreated.status} (0: DEPOSIT)`);
  console.log(` - 예치 금액: ${ethers.formatUnits(escrowCreated.amount, 0)} 토큰`);

  console.log(`[4] 배송 기록 생성`);
  await Escrow.connect(seller).startDelivery(firstEscrowId, "1234-5678", "CJ대한통운", proposalId);
  const deliveryInfoAfterStart = await Escrow.escrows(firstEscrowId);
  console.log(` - 배송 시작 확인. 상태: ${deliveryInfoAfterStart.status} (1: DELIVERING)`);

  await Escrow.connect(oracle).confirmDeliveryStatus(firstEscrowId, true, proposalId);
  const deliveryInfoAfterConfirm = await Escrow.escrows(firstEscrowId);
  console.log(` - 오라클이 배송 완료 확인. 상태: ${deliveryInfoAfterConfirm.status} (2: DELIVERED)`);

  console.log(`[5] 정산`);
  const autoReleaseDelay: bigint = await Escrow.AUTO_RELEASE_DELAY();
  console.log(`⏳ 자동 정산 지연 시간(${autoReleaseDelay}초) 경과 대기...`);
  await time.increase(Number(autoReleaseDelay) + 10);

  await Escrow.connect(anotherUser).autoReleaseFunds(firstEscrowId, proposalId);
  const finalEscrowStatus = (await Escrow.escrows(firstEscrowId)).status;
  const sellerFinalBalance = await MyToken.balanceOf(seller.address);
  console.log(` - 자동 정산 성공!`);
  console.log(` - 에스크로 최종 상태: ${finalEscrowStatus} (3: COMPLETED)`);
  console.log(` - 판매자 최종 잔액: ${ethers.formatUnits(sellerFinalBalance, 0)} 토큰`);

  console.log("\n완료");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
