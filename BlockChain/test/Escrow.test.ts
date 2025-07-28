import { expect } from "chai";
import { Escrow, MyToken } from "../typechain-types";
import { ethers } from "hardhat";
import { BigNumberish } from "ethers";
import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

function stringToBytes32(str: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(str));
}

/**
 * @description EIP-712 permit 서명을 위한 도메인 정의 헬퍼
 */
async function getPermitSignature(
  signer: SignerWithAddress,
  token: MyToken,
  spender: string,
  value: BigNumberish,
  deadline: BigNumberish
) {
  const domain = {
    name: await token.name(),
    version: "1",
    chainId: (await ethers.provider.getNetwork()).chainId,
    verifyingContract: await token.getAddress()
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const nonce = await token.nonces(await signer.getAddress());

  const message = {
    owner: await signer.getAddress(),
    spender: spender,
    value: value,
    nonce: nonce,
    deadline: deadline,
  };

  const signature = await ethers.provider.send('eth_signTypedData_v4', [
    await signer.getAddress(),
    JSON.stringify({
      types: types,
      domain: domain,
      primaryType: "Permit",
      message: message
    }, (key, value) => {
      return typeof value === 'bigint' ? value.toString() : value;
    })
  ]);

  // V, R, S 값 분리
  return ethers.Signature.from(signature);

}

describe("Escrow", function () {
  let MyTokenContract: MyToken;
  let EscrowContract: Escrow;
  let deployer: SignerWithAddress;
  let client: SignerWithAddress;
  let seller: SignerWithAddress;
  let oracle: SignerWithAddress;
  let arbiter: SignerWithAddress;
  let nonRoleUser: SignerWithAddress; // 권한 없는 유저

  const initialMyTokenSupply: bigint = ethers.parseUnits("1000000", 0);
  const autoReleaseDelay = 60 * 5;
  const escrowAmount: bigint = ethers.parseUnits('1000', 0); // 에스크로 토큰 금액
  const proposalId = ethers.keccak256(ethers.toUtf8Bytes("PROPOSAL_14"));

  async function deployEscrowFixture() {
    [deployer, client, seller, oracle, arbiter, nonRoleUser] = await ethers.getSigners();

    // MyToken 배포
    const MyTokenFactory = await ethers.getContractFactory("MyToken");
    MyTokenContract = await MyTokenFactory.connect(deployer).deploy("ReUseToken", "RUT", initialMyTokenSupply);
    await MyTokenContract.waitForDeployment();

    // Escrow 배포
    const EscrowFactory = await ethers.getContractFactory("Escrow");
    EscrowContract = await EscrowFactory.connect(deployer).deploy(autoReleaseDelay);
    await EscrowContract.waitForDeployment();

    // Role 부여
    await EscrowContract.connect(deployer).grantRole(await EscrowContract.ORACLE_ROLE(), await oracle.getAddress());
    await EscrowContract.connect(deployer).grantRole(await EscrowContract.ARBITER_ROLE(), await arbiter.getAddress());

    await MyTokenContract.connect(deployer).transfer(await client.getAddress(), escrowAmount * 10n);

    return { MyTokenContract, EscrowContract, deployer, client, seller, oracle, arbiter, nonRoleUser, initialMyTokenSupply, escrowAmount, proposalId };

  }

  /**
   * @description 컨트랙트 배포 및 초기 상태 테스트
   */
  describe("Deployment & Initial State", function () {
    it("Should set the correct initial state and roles", async function () {
      const { EscrowContract, deployer, oracle, arbiter } = await loadFixture(deployEscrowFixture);

      expect(await EscrowContract.nextEscrowId()).to.equal(1);
      expect(await EscrowContract.AUTO_RELEASE_DELAY()).to.equal(autoReleaseDelay);

      // Role 부여 테스트
      expect(await EscrowContract.hasRole(await EscrowContract.DEFAULT_ADMIN_ROLE(), await deployer.getAddress())).to.be.true;
      expect(await EscrowContract.hasRole(await EscrowContract.ORACLE_ROLE(), await oracle.getAddress())).to.be.true;
      expect(await EscrowContract.hasRole(await EscrowContract.ARBITER_ROLE(), await arbiter.getAddress())).to.be.true;

      // 별도 권한 추가 확인
      expect(await EscrowContract.hasRole(await EscrowContract.ORACLE_ROLE(), await deployer.getAddress())).to.be.false;
      expect(await EscrowContract.hasRole(await EscrowContract.ORACLE_ROLE(), await arbiter.getAddress())).to.be.false;
      expect(await EscrowContract.hasRole(await EscrowContract.ARBITER_ROLE(), await deployer.getAddress())).to.be.false;
      expect(await EscrowContract.hasRole(await EscrowContract.ARBITER_ROLE(), await oracle.getAddress())).to.be.false;

      // 비권한 유저 테스트
      expect(await EscrowContract.hasRole(await EscrowContract.DEFAULT_ADMIN_ROLE(), await nonRoleUser.getAddress())).to.be.false;
      expect(await EscrowContract.hasRole(await EscrowContract.ORACLE_ROLE(), await nonRoleUser.getAddress())).to.be.false;
      expect(await EscrowContract.hasRole(await EscrowContract.ARBITER_ROLE(), await nonRoleUser.getAddress())).to.be.false;

    });
  });

  /**
 * @description 에스크로 예치(Deposit) 기능 관련 테스트 스위트.
 * 클라이언트가 토큰을 에스크로 컨트랙트에 성공적으로 예치하는지 테스트
 */
  describe("Deposit", function () {
    it("Should allow client to deposit funds and emit EscrowCreated Event", async function () {
      const { EscrowContract, MyTokenContract, client, seller, escrowAmount, proposalId } = await loadFixture(deployEscrowFixture);
      const escrowId = 1;
      const deadline = (await time.latest()) + 3600;

      const { v, r, s } = await getPermitSignature(
        client,
        MyTokenContract,
        await EscrowContract.getAddress(),
        escrowAmount,
        deadline
      );

      await expect(EscrowContract.connect(client).deposit(
        await client.getAddress(),
        await seller.getAddress(),
        escrowAmount,
        await MyTokenContract.getAddress(),
        escrowAmount,
        deadline,
        v, r, s,
        proposalId
      ))
        .to.emit(EscrowContract, "EscrowCreated")
        .withArgs(
          escrowId,
          await seller.getAddress(),
          await client.getAddress(),
          escrowAmount,
          MyTokenContract.getAddress(),
          proposalId)
        .to.emit(EscrowContract, "DeliveryDetailsUpdated")
        .withArgs(escrowId, "", "", "상품 준비 중", "", anyValue, proposalId);

      expect(await MyTokenContract.balanceOf(await EscrowContract.getAddress())).to.equal(escrowAmount);

      expect(await MyTokenContract.balanceOf(await client.getAddress())).to.equal(escrowAmount * 9n);

      const escrowInfo = await EscrowContract.escrows(escrowId);
      expect(escrowInfo.status).to.equal(0); // EscrowStatus.DEPOSIT
    });
  }); // Deposit Ends 

}
);