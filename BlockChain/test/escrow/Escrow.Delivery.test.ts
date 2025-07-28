import { expect } from "chai";
import { BigNumberish, getAddress } from 'ethers';
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { deployEscrowFixture, escrowAmount, proposalId, seller, client, nonRoleUser, oracle } from '../fixtures/escrowFixture';
import { getPermitSignature } from "../../utils/signature";
import stringToBytes32 from "../../utils/stringToBytes32";

/**
 * @description 에스크로 배송 프로세스 관련 테스트 스위트.
 * 판매자 배송 & 오라클이 배송 정보를 업데이트하는지 테스트.
 */
describe("Escrow - Delivery Process", function () {
  let escrowId: BigNumberish;
  let clientAddr: string;
  let sellerAddr: string;
  let oracleAddr: string;
  let nonRoleUserAddr: string;
  let EscrowContract: any;
  let MyTokenContract: any;

  beforeEach(async function name() {
    const fixture = await loadFixture(deployEscrowFixture);
    MyTokenContract = fixture.MyTokenContract;
    EscrowContract = fixture.EscrowContract;
    clientAddr = await fixture.client.getAddress();
    sellerAddr = await fixture.seller.getAddress();
    oracleAddr = await fixture.oracle.getAddress();
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

  it("Should allow seller to start delivery and emit DeliveryDetailsUpdated event", async function () {

    const currentEscrowId = escrowId;
    const trackingNumber = "AA123456";
    const courier = "TEST";

    await expect(EscrowContract.connect(seller).startDelivery(escrowId, trackingNumber, courier, proposalId))
      .to.emit(EscrowContract, "DeliveryDetailsUpdated")
      .withArgs(
        escrowId,
        trackingNumber,
        courier,
        "배송 중",
        "",
        anyValue,
        proposalId
      );
    const escrow = await EscrowContract.escrows(currentEscrowId);

    expect(escrow.status).to.equal(1);
    expect(escrow.deliveryDetails.trackingNumber).to.equal(trackingNumber);
    expect(escrow.deliveryDetails.courier).to.equal(courier);
    expect(escrow.deliveryDetails.currentStatus).to.equal("배송 중");
    expect(escrow.deliveryDetails.location).to.equal("");
    expect(escrow.deliveryDetails.lastUpdated).to.be.gt(0);
  });

  it("Should allow oracle to start delivery and emit DeliveryDetailsUpdated event", async function name() {
    const currentEscrowId = escrowId;
    const trackingNumber = "TN_ORACLE_001";
    const courier = "OracleLogistics";

    await expect(EscrowContract.connect(oracle).startDelivery(escrowId, trackingNumber, courier, proposalId))
      .to.emit(EscrowContract, "DeliveryDetailsUpdated")
      .withArgs(
        escrowId,
        trackingNumber,
        courier,
        "배송 중",
        "",
        anyValue,
        proposalId
      );

    const escrow = await EscrowContract.escrows(currentEscrowId);
    expect(escrow.status).to.equal(1);
  });
  it("Should not allow non-seller or non-oracle to start delivery", async function () {
    const currentEscrowId = escrowId;

    await expect(EscrowContract.connect(client).startDelivery(currentEscrowId, "TN", "C", proposalId))
      .to.be.revertedWith("Escrow: Only seller or oracle can start delivery");
    await expect(EscrowContract.connect(nonRoleUser).startDelivery(currentEscrowId, "TN", "C", proposalId))
      .to.be.revertedWith("Escrow: Only seller or oracle can start delivery");
  });

  it("Should allow oracle to update delivery details and emit DeliveryDetailsUpdated event", async function () {
    const currentEscrowId = escrowId;

    await EscrowContract.connect(seller).startDelivery(currentEscrowId, "TN_INITIAL", "Courier_Initial", proposalId);

    const newTrackingNumber = "TN98765";
    const newCourier = "Post_Express";
    const newStatus = "배송 완료";
    const newLocation = "고객님 댁 앞";

    await expect(EscrowContract.connect(oracle).updateDeliveryDetails(
      currentEscrowId,
      newTrackingNumber,
      newCourier,
      newStatus,
      newLocation,
      proposalId
    ))
      .to.emit(EscrowContract, "DeliveryDetailsUpdated")
      .withArgs(
        currentEscrowId,
        newTrackingNumber,
        newCourier,
        newStatus,
        newLocation,
        anyValue,
        proposalId
      );

    const escrow = await EscrowContract.escrows(currentEscrowId);
    expect(escrow.deliveryDetails.trackingNumber).to.equal(newTrackingNumber);
    expect(escrow.deliveryDetails.courier).to.equal(newCourier);
    expect(escrow.deliveryDetails.currentStatus).to.equal(newStatus);
    expect(escrow.deliveryDetails.location).to.equal(newLocation);
  });

  it("Should not allow non-oracle to update delivery details", async function () {
    const currentEscrowId = escrowId;

    await EscrowContract.connect(seller).startDelivery(currentEscrowId, "TN_INITIAL", "Courier_Initial", proposalId);

    await expect(EscrowContract.connect(client).updateDeliveryDetails(
      currentEscrowId, "TN_UPDATED", "C", "S", "L", proposalId
    )).to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");

    await expect(EscrowContract.connect(seller).updateDeliveryDetails(
      currentEscrowId, "TN_UPDATED", "C", "S", "L", proposalId
    )).to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");

    await expect(EscrowContract.connect(nonRoleUser).updateDeliveryDetails(
      currentEscrowId, "TN_UPDATED", "C", "S", "L", proposalId
    )).to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount");
  });

});