import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { deployEscrowFixture } from "../fixtures/escrowFixture";

/**
 * @description Escrow 컨트랙트의 배포 및 초기 상태 관련 테스트 스위트.
 * 컨트랙트 배포 테스트.
 */
describe("Escrow - Deployment & Initial State", function () {
  let EscrowContract: any;
  let oracleAddr: string;
  let arbiterAddr: string;
  let deployerAddr: string;

  beforeEach(async function () {
    const fixture = await loadFixture(deployEscrowFixture);
    deployerAddr = await fixture.deployer.getAddress();
    EscrowContract = fixture.EscrowContract;
    oracleAddr = await fixture.oracle.getAddress();
    arbiterAddr = await fixture.arbiter.getAddress();
  });

  it("Should set the correct initial state and roles", async function () {
    expect(await EscrowContract.hasRole(await EscrowContract.DEFAULT_ADMIN_ROLE(), deployerAddr)).to.be.true;

    // 오라클 및 중재자 역할이 올바르게 부여되었는지 확인
    expect(await EscrowContract.hasRole(await EscrowContract.ORACLE_ROLE(), oracleAddr)).to.be.true;
    expect(await EscrowContract.hasRole(await EscrowContract.ARBITER_ROLE(), arbiterAddr)).to.be.true;

    // 다음 에스크로 ID가 1로 초기화되었는지 확인
    expect(await EscrowContract.nextEscrowId()).to.equal(1);
  });
});