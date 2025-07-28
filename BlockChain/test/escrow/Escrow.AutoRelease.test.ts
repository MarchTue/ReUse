import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { deployEscrowFixture, EscrowContract, escrowAmount, proposalId, seller, oracle, autoReleaseDelay, client, deployer } from '../fixtures/escrowFixture';
import { BigNumberish } from "ethers";
import { expect } from "chai";
import { getPermitSignature } from "../../utils/signature";

describe("Escrow - Auto-Release", function () {
  let escrowId: BigNumberish;
  let deployerAddr: string;
  let clientAddr: string;
  let sellerAddr: string;
  let oracleAddr: string;
  let arbiterAddr: string;
  let nonRoleUserAddr: string;
  let EscrowContract: any;
  let MyTokenContract: any;

  beforeEach(async function () {
    const fixture = await loadFixture(deployEscrowFixture);
    MyTokenContract = fixture.MyTokenContract;
    EscrowContract = fixture.EscrowContract;
    deployerAddr = await fixture.deployer.getAddress();
    clientAddr = await fixture.client.getAddress();
    sellerAddr = await fixture.seller.getAddress();
    oracleAddr = await fixture.oracle.getAddress();
    arbiterAddr = await fixture.arbiter.getAddress();
    nonRoleUserAddr = await fixture.nonRoleUser.getAddress();

    const deadline = (await time.latest()) + 3600;
    const { v, r, s } = await getPermitSignature(
      fixture.client, MyTokenContract, await EscrowContract.getAddress(), escrowAmount, deadline
    );
    await EscrowContract.connect(fixture.client).deposit(
      clientAddr, sellerAddr, escrowAmount, await MyTokenContract.getAddress(), escrowAmount, deadline, v, r, s, proposalId
    );
    escrowId = (await EscrowContract.nextEscrowId()) - 1n; // 생성된 에스크로 ID
  });

  it("Should allow auto-release after AUTO_RELEASE_DELAY and emit FundsReleased event", async function () {
    await EscrowContract.connect(seller).startDelivery(escrowId, 'T', 'C', proposalId);
    await EscrowContract.connect(oracle).confirmDeliveryStatus(escrowId, true, proposalId);

    await time.increase(autoReleaseDelay + 5);

    const initialSellerBalance = await MyTokenContract.balanceOf(sellerAddr);
    const initialEscrowBalance = await MyTokenContract.balanceOf(await EscrowContract.getAddress());

    await expect(EscrowContract.connect(client).autoReleaseFunds(escrowId, proposalId))
      .to.emit(EscrowContract, "FundsReleased")
      .withArgs(escrowId, sellerAddr, escrowAmount, proposalId);

    expect(await MyTokenContract.balanceOf(sellerAddr)).to.equal(initialSellerBalance + escrowAmount);
    expect(await MyTokenContract.balanceOf(await EscrowContract.getAddress())).to.equal(initialEscrowBalance - escrowAmount);

    const escrow = await EscrowContract.escrows(escrowId);
    expect(escrow.status).to.equal(3); // EscrowStatus.COMPLETED
  });

  it("Should revert auto-release if AUTO_RELEASE_DELAY has not passed", async function () {
    await EscrowContract.connect(seller).startDelivery(escrowId, 'T', 'C', proposalId);
    await EscrowContract.connect(oracle).confirmDeliveryStatus(escrowId, true, proposalId);

    await time.increase(autoReleaseDelay - 5);

    const initialSellerBalance = await MyTokenContract.balanceOf(sellerAddr);
    const initialEscrowBalance = await MyTokenContract.balanceOf(await EscrowContract.getAddress());

    await expect(EscrowContract.connect(client).autoReleaseFunds(escrowId, proposalId))
      .to.be.revertedWithoutReason();
  });

  it("Should revert auto-release if not in DELIVERED state", async function () {
    await time.increase(autoReleaseDelay + 5);

    await expect(EscrowContract.connect(client).autoReleaseFunds(escrowId, proposalId))
      .to.be.revertedWithoutReason();
  });

  it("Should revert auto-release if already completed or canceled", async function () {
    await EscrowContract.connect(deployer).releaseFunds(escrowId, proposalId);
    await time.increase(autoReleaseDelay + 1);
    await expect(EscrowContract.connect(client).autoReleaseFunds(escrowId, proposalId))
      .to.be.revertedWithoutReason();
  });

});