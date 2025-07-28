import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumberish } from "ethers";
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

import { deployEscrowFixture, escrowAmount, proposalId, proposalId2 } from "../fixtures/escrowFixture";
import { getPermitSignature } from "../../utils/signature";


describe("Escrow - Deposit (with ERC20Permit)", function () {

  it("Should allow client to deposit funds using permit and emit EscrowCreated & FundsDeposited events", async function () {
    const { EscrowContract, MyTokenContract, client, seller } = await loadFixture(deployEscrowFixture);

    const escrowId = 1;
    const deadline = (await time.latest()) + 3600;

    const { v, r, s } = await getPermitSignature(
      client, MyTokenContract, await EscrowContract.getAddress(), escrowAmount, deadline
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
        await MyTokenContract.getAddress(),
        proposalId
      )
      .to.emit(EscrowContract, "FundsDeposited")
      .withArgs(escrowId, await client.getAddress(), escrowAmount, proposalId)
      .to.emit(EscrowContract, "DeliveryDetailsUpdated")
      .withArgs(
        escrowId,
        "",
        "",
        "상품 준비 중",
        "",
        anyValue,
        proposalId
      );

    expect(await MyTokenContract.balanceOf(await EscrowContract.getAddress())).to.equal(escrowAmount);
    expect(await MyTokenContract.balanceOf(await client.getAddress())).to.equal(escrowAmount * 9n);

    const escrowInfo = await EscrowContract.escrows(escrowId);
    expect(escrowInfo.status).to.equal(0);
  });

});