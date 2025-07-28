import { expect } from "chai";
import { ethers } from "hardhat";
import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { deployEscrowFixture, escrowAmount, proposalId, proposalId2 } from "../fixtures/escrowFixture";
import { getPermitSignature } from "../../utils/signature";

/**
 * @description 에스크로 예치(Deposit) 기능 관련 테스트 스위트.
 * 클라이언트가 ERC20 Permit을 사용하여 토큰을 에스크로 컨트랙트에 성공적으로 예치하는지 테스트.
 */
describe("Escrow - Deposit (with ERC20Permit)", function () {
  let clientAddr: string;
  let sellerAddr: string;
  let EscrowContract: any;
  let MyTokenContract: any;

  beforeEach(async function () {
    const fixture = await loadFixture(deployEscrowFixture);
    MyTokenContract = fixture.MyTokenContract;
    EscrowContract = fixture.EscrowContract;
    clientAddr = await fixture.client.getAddress();
    sellerAddr = await fixture.seller.getAddress();
  });

  it("Should allow client to deposit funds using permit and emit EscrowCreated & FundsDeposited events", async function () {
    const { client } = await loadFixture(deployEscrowFixture);

    const escrowId = 1;
    const deadline = (await time.latest()) + 3600;

    const { v, r, s } = await getPermitSignature(
      client, MyTokenContract, await EscrowContract.getAddress(), escrowAmount, deadline
    );

    await expect(EscrowContract.connect(client).deposit(
      clientAddr,                 // _client
      sellerAddr,                 // _seller
      escrowAmount,               // _amount
      await MyTokenContract.getAddress(), // _tokenAddress
      escrowAmount,               // _permitValue
      deadline,                   // _deadline
      v, r, s,                    // _v, _r, _s
      proposalId                  // _proposalId
    ))
      .to.emit(EscrowContract, "EscrowCreated")
      .withArgs(
        escrowId,
        sellerAddr,
        clientAddr,
        escrowAmount,
        await MyTokenContract.getAddress(),
        proposalId
      )
      .to.emit(EscrowContract, "FundsDeposited")
      .withArgs(
        escrowId,
        clientAddr,
        escrowAmount,
        proposalId
      )
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
    expect(await MyTokenContract.balanceOf(clientAddr)).to.equal(escrowAmount * 9n);

    const escrowInfo = await EscrowContract.escrows(escrowId);
    expect(escrowInfo.status).to.equal(0); // EscrowStatus.DEPOSIT
  });

  it("Should not allow deposit with invalid permit signature", async function () {
    const { client } = await loadFixture(deployEscrowFixture);

    const deadline = (await time.latest()) + 3600;
    const { v, r, s } = await getPermitSignature(
      client, MyTokenContract, await EscrowContract.getAddress(), escrowAmount - 1n, deadline
    );

    await expect(EscrowContract.connect(client).deposit(
      clientAddr,
      sellerAddr,
      escrowAmount,
      await MyTokenContract.getAddress(),
      escrowAmount,
      deadline,
      v, r, s,
      proposalId2
    )).to.be.revertedWithCustomError(MyTokenContract, "ERC2612InvalidSigner"); 
  });

  it("Should not allow deposit if buyer is zero address", async function () {
    const { client } = await loadFixture(deployEscrowFixture);

    const deadline = (await time.latest()) + 3600;
    const { v, r, s } = await getPermitSignature(
      client, MyTokenContract, await EscrowContract.getAddress(), escrowAmount, deadline
    );

    await expect(EscrowContract.connect(client).deposit(
      ethers.ZeroAddress, // Buyer를 0x0으로 설정
      sellerAddr,
      escrowAmount,
      await MyTokenContract.getAddress(),
      escrowAmount,
      deadline,
      v, r, s,
      proposalId
    )).to.be.revertedWith("Escrow : Buyer cannot be zero address ");
  });

  it("Should not allow deposit if seller is zero address", async function () {
    const { client } = await loadFixture(deployEscrowFixture);

    const deadline = (await time.latest()) + 3600;
    const { v, r, s } = await getPermitSignature(
      client, MyTokenContract, await EscrowContract.getAddress(), escrowAmount, deadline
    );

    await expect(EscrowContract.connect(client).deposit(
      clientAddr,
      ethers.ZeroAddress,
      escrowAmount,
      await MyTokenContract.getAddress(),
      escrowAmount,
      deadline,
      v, r, s,
      proposalId
    )).to.be.revertedWith("Escrow : Seller cannot be zero address");
  });

  it("Should not allow deposit with zero amount", async function () {
    const { client } = await loadFixture(deployEscrowFixture);

    const deadline = (await time.latest()) + 3600;
    const { v, r, s } = await getPermitSignature(
      client, MyTokenContract, await EscrowContract.getAddress(), 0, deadline
    );

    await expect(EscrowContract.connect(client).deposit(
      clientAddr,
      sellerAddr,
      0,
      await MyTokenContract.getAddress(),
      0,
      deadline,
      v, r, s,
      proposalId
    )).to.be.revertedWith("Escrow : Amount must be greater than zero");
  });

  it("Should not allow deposit if buyer and seller are the same", async function () {
    const { client } = await loadFixture(deployEscrowFixture);

    const deadline = (await time.latest()) + 3600;
    const { v, r, s } = await getPermitSignature(
      client, MyTokenContract, await EscrowContract.getAddress(), escrowAmount, deadline
    );

    await expect(EscrowContract.connect(client).deposit(
      clientAddr,
      clientAddr, // Buyer와 Seller가 동일
      escrowAmount,
      await MyTokenContract.getAddress(),
      escrowAmount,
      deadline,
      v, r, s,
      proposalId
    )).to.be.revertedWith("Escrow : Buyer and seller cannot be the same");
  });

  it("Should create multiple escrows correctly", async function () {
    const { client } = await loadFixture(deployEscrowFixture);

    const deadline = (await time.latest()) + 3600;

    // 첫 번째 에스크로 생성
    const { v: v1, r: r1, s: s1 } = await getPermitSignature(
      client, MyTokenContract, await EscrowContract.getAddress(), escrowAmount, deadline
    );
    await EscrowContract.connect(client).deposit(
      clientAddr, sellerAddr, escrowAmount, await MyTokenContract.getAddress(), escrowAmount, deadline, v1, r1, s1, proposalId
    );
    expect(await EscrowContract.nextEscrowId()).to.equal(2);
    expect(await MyTokenContract.balanceOf(await EscrowContract.getAddress())).to.equal(escrowAmount);

    // 두 번째 에스크로 생성 (새로운 permit 서명 필요)
    const { v: v2, r: r2, s: s2 } = await getPermitSignature(
      client, MyTokenContract, await EscrowContract.getAddress(), escrowAmount, deadline
    );
    await EscrowContract.connect(client).deposit(
      clientAddr, sellerAddr, escrowAmount, await MyTokenContract.getAddress(), escrowAmount, deadline, v2, r2, s2, proposalId2
    );
    expect(await EscrowContract.nextEscrowId()).to.equal(3);
    expect(await MyTokenContract.balanceOf(await EscrowContract.getAddress())).to.equal(escrowAmount * 2n);
  });
});