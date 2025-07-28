import { expect } from "chai";
import { BigNumberish, getAddress } from 'ethers';
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { deployEscrowFixture, escrowAmount, proposalId, seller, client, arbiter, nonRoleUser, oracle, deployer } from '../fixtures/escrowFixture';
import { getPermitSignature } from "../../utils/signature";
import stringToBytes32 from "../../utils/stringToBytes32";

/**
 * @description 에스크로 자금 정산 (Release Funds) 및 환불 (Refund) 기능 관련 테스트 스위트.
 * 구매자/판매자 자금 정산  환불 요청, 중재자 승인 테스트.
 */
describe("Escrow - Funds Release & Refund", function () {
  let escrowId: BigNumberish;
  let clientAddr: string;
  let sellerAddr: string;
  let oracleAddr: string;
  let nonRoleUserAddr: string;
  let arbiterAddr: string;
  let EscrowContract: any;
  let MyTokenContract: any;

  this.beforeEach(async function () {
    const fixture = await loadFixture(deployEscrowFixture);
    MyTokenContract = fixture.MyTokenContract;
    EscrowContract = fixture.EscrowContract;
    clientAddr = await fixture.client.getAddress();
    sellerAddr = await fixture.seller.getAddress();
    oracleAddr = await fixture.oracle.getAddress();
    arbiterAddr = await fixture.arbiter.getAddress();
    nonRoleUserAddr = await fixture.nonRoleUser.getAddress();

    const deadline = (await time.latest()) + 3600;
    const { v, r, s } = await getPermitSignature(
      fixture.client, MyTokenContract, await EscrowContract.getAddress(), escrowAmount, deadline
    );

    // 미리 deposit 을 실행시켜 예치해둠.
    await EscrowContract.connect(fixture.client).deposit(
      clientAddr, sellerAddr, escrowAmount, await MyTokenContract.getAddress(), escrowAmount, deadline, v, r, s, proposalId
    );

    escrowId = (await EscrowContract.nextEscrowId()) - 1n;
  });

  it("Should allow buyer to claim funds if delivered and not disputed, emit FundsReleased event", async function () {
    await EscrowContract.connect(oracle).startDelivery(escrowId, "TN_claim", "Courier_claim", proposalId);

    await EscrowContract.connect(oracle).confirmDeliveryStatus(escrowId, true, proposalId);

    const initialSellerBalance = await MyTokenContract.balanceOf(sellerAddr);

    await expect(EscrowContract.connect(client).claimFunds(escrowId, proposalId))
      .to.emit(EscrowContract, "FundsReleased")
      .withArgs(escrowId, sellerAddr, escrowAmount, proposalId);

    expect(await MyTokenContract.balanceOf(sellerAddr)).to.equal(initialSellerBalance + escrowAmount);
    expect(await MyTokenContract.balanceOf(await EscrowContract.getAddress())).to.equal(0);
    const escrow = await EscrowContract.escrows(escrowId);
    expect(escrow.status).to.equal(3); // EscrowStatus.COMPLETED
  });

  it("Should not allow non-buyer to claim funds", async function () {

    await EscrowContract.connect(oracle).startDelivery(escrowId, "TN_claim", "Courier_claim", proposalId);
    await EscrowContract.connect(oracle).confirmDeliveryStatus(escrowId, true, proposalId);

    await expect(EscrowContract.connect(seller).claimFunds(escrowId, proposalId))
      .to.be.revertedWithoutReason();
    await expect(EscrowContract.connect(nonRoleUser).claimFunds(escrowId, proposalId))
      .to.be.revertedWithoutReason();
  });

  it("Should not allow claim funds if not in DELIVERED state", async function () {
    await expect(EscrowContract.connect(client).claimFunds(escrowId, proposalId))
      .to.be.revertedWithoutReason();
  });

  it("Should allow admin to release funds forcefully and emit FundsReleased event", async function () {

    const initialSellerBalance = await MyTokenContract.balanceOf(sellerAddr);
    const initialEscrowBalance = await MyTokenContract.balanceOf(await EscrowContract.getAddress());

    await expect(EscrowContract.connect(deployer).releaseFunds(escrowId, proposalId))
      .to.emit(EscrowContract, "FundsReleased")
      .withArgs(escrowId, sellerAddr, escrowAmount, proposalId);

    expect(await MyTokenContract.balanceOf(sellerAddr)).to.equal(initialSellerBalance + escrowAmount);
    expect(await MyTokenContract.balanceOf(await EscrowContract.getAddress())).to.equal(initialEscrowBalance - escrowAmount);
    const escrow = await EscrowContract.escrows(escrowId);
    expect(escrow.status).to.equal(3); // EscrowStatus.COMPLETED
  });

  it("Should not allow non-admin to release funds forcefully", async function () {

    await expect(EscrowContract.connect(client).releaseFunds(escrowId, proposalId))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");
    await expect(EscrowContract.connect(seller).releaseFunds(escrowId, proposalId))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");
    await expect(EscrowContract.connect(oracle).releaseFunds(escrowId, proposalId))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");
    await expect(EscrowContract.connect(arbiter).releaseFunds(escrowId, proposalId))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");
    await expect(EscrowContract.connect(nonRoleUser).releaseFunds(escrowId, proposalId))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");
  });


  it("Should allow admin to refund funds forcefully and emit FundsRefunded event", async function () {

    const initialClientBalance = await MyTokenContract.balanceOf(clientAddr);
    const initialEscrowBalance = await MyTokenContract.balanceOf(await EscrowContract.getAddress());

    await expect(EscrowContract.connect(deployer).refundFunds(escrowId, proposalId))
      .to.emit(EscrowContract, "FundsRefunded")
      .withArgs(escrowId, clientAddr, escrowAmount, proposalId);

    expect(await MyTokenContract.balanceOf(clientAddr)).to.equal(initialClientBalance + escrowAmount);
    expect(await MyTokenContract.balanceOf(await EscrowContract.getAddress())).to.equal(initialEscrowBalance - escrowAmount);
    const escrow = await EscrowContract.escrows(escrowId);
    expect(escrow.status).to.equal(6); // EscrowStatus.CANCELED
  });

  it("Should not allow non-admin to refund funds forcefully", async function () {

    await expect(EscrowContract.connect(client).refundFunds(escrowId, proposalId))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");
    await expect(EscrowContract.connect(seller).refundFunds(escrowId, proposalId))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");
    await expect(EscrowContract.connect(oracle).refundFunds(escrowId, proposalId))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");
    await expect(EscrowContract.connect(arbiter).refundFunds(escrowId, proposalId))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");
    await expect(EscrowContract.connect(nonRoleUser).refundFunds(escrowId, proposalId))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");
  });

});