import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Cash Contract", function () {
  async function deployCashFixture() {
    const [owner, user, addr2] = await hre.ethers.getSigners();

    // MyToken 배포
    const MyTokenFactory = await hre.ethers.getContractFactory("MyToken");
    const initialSupply = 1000;
    const myToken = await MyTokenFactory.deploy("RU Token", "RU", initialSupply);
    await myToken.waitForDeployment();

    //  Cash 배포
    const CashFactory = await hre.ethers.getContractFactory("Cash");
    const cash = await CashFactory.deploy(myToken.getAddress());
    await cash.waitForDeployment();
    await myToken.addAdmin(cash.getAddress());
    // Cash에 owner를 관리자 추가
    await cash.addCashAdmin(owner.address);

    return { myToken, cash, owner, user, addr2 };
  }

  // 배포  테스트
  describe("Deployment", function () {
    it("Should set correct MyToken address in Cash", async function () {
      const { cash, myToken } = await loadFixture(deployCashFixture);
      expect(await cash.ruToken()).to.equal(await myToken.getAddress());
    });
  });

  // 충전 / 출금
  describe("Charge and Withdraw", function () {
    it("Should charge RU correctly and emit CashCharged event", async function () {
      const { cash, myToken, user, owner } = await loadFixture(deployCashFixture);
      const amount = 100;

      const tx = await cash.chargeRU(user.address, amount, "tx-123");
      await tx.wait();

      // 잔액 확인
      expect(await myToken.balanceOf(user.address)).to.equal(amount);

      // 이벤트 확인
      await expect(tx)
        .to.emit(cash, "CashCharged")
        .withArgs(user.address, amount, "tx-123");
    });

    it("Should withdraw RU correctly and emit CashWithdrawn event", async function () {
      const { cash, myToken, user, owner } = await loadFixture(deployCashFixture);
      const amount = 50;

      // 충전
      await cash.chargeRU(user.address, amount, "tx-123");

      // 출금
      const tx = await cash.withdrawRU(user.address, amount, "tx-456");
      await tx.wait();

      // 잔액 확인
      expect(await myToken.balanceOf(user.address)).to.equal(0);

      // 이벤트 확인
      await expect(tx)
        .to.emit(cash, "CashWithdrawn")
        .withArgs(user.address, amount, "tx-456");
    });

    it("Should revert if non-admin tries to charge", async function () {
      const { cash, user } = await loadFixture(deployCashFixture);
      const amount = 10;

      await expect(
        cash.connect(user).chargeRU(user.address, amount, "tx-999")
      ).to.be.revertedWithCustomError(cash, "AccessControlUnauthorizedAccount");
    });

    it("Should revert if non-admin tries to withdraw", async function () {
      const { cash, user } = await loadFixture(deployCashFixture);
      const amount = 10;

      await expect(
        cash.connect(user).withdrawRU(user.address, amount, "tx-999")
      ).to.be.revertedWithCustomError(cash, "AccessControlUnauthorizedAccount");
    });
  });

  // 관리자 역할 테스트
  describe("Admin management", function () {
    it("Should allow owner to add new admin", async function () {
      const { cash, owner, addr2 } = await loadFixture(deployCashFixture);

      await cash.addCashAdmin(addr2.address);

      // addr2가 관리자 권한으로 충전 가능해야 함
      const tx = await cash.connect(addr2).chargeRU(addr2.address, 10, "tx-admin");
      await expect(tx)
        .to.emit(cash, "CashCharged")
        .withArgs(addr2.address, 10, "tx-admin");
    });
  });
});
