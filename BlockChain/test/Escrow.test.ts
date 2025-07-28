import { expect } from "chai";
import { ethers } from "hardhat";
import { Escrow, MyToken } from "../typechain-types";
import { Signer, BigNumberish } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";


function stringToBytes32(str: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(str));
}

describe("Escrow", function () {
  let MyTokenContract: MyToken;
  let EscrowContract: Escrow;
  let deployer: Signer;
  let client: Signer;
  let seller: Signer;
  let oracle: Signer;
  let arbiter: Signer;
  let nonRoleUser: Signer; // 권한 없는 유저

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

    await MyTokenContract.connect(deployer).transfer(await client.getAddress(), escrowAmount * 5n);

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
}
);