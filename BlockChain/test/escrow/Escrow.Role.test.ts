import { loadFixture, time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { deployEscrowFixture, EscrowContract, escrowAmount, proposalId } from "../fixtures/escrowFixture";
import { BigNumberish } from "ethers";
import { expect } from "chai";
import { getPermitSignature } from "../../utils/signature";


describe("Escrow - Roles", function () {
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

  it("Should allow admin to grant a role (ORACLE_ROLE)", async function () {
    const { deployer, nonRoleUser } = await loadFixture(deployEscrowFixture);
    const ORACLE_ROLE = await EscrowContract.ORACLE_ROLE();
    const nonRoleUserAddress = await nonRoleUser.getAddress();

    // 기존에 ORACLE_ROLE이 없는지 확인
    expect(await EscrowContract.hasRole(ORACLE_ROLE, nonRoleUserAddress)).to.be.false;

    await expect(EscrowContract.connect(deployer).grantRole(ORACLE_ROLE, nonRoleUserAddress))
      .to.emit(EscrowContract, "RoleGranted")
      .withArgs(ORACLE_ROLE, nonRoleUserAddress, deployerAddr);

    expect(await EscrowContract.hasRole(ORACLE_ROLE, nonRoleUserAddress)).to.be.true;
  });

  it("Should allow admin to revoke a role (ORACLE_ROLE)", async function () {
    const { deployer, oracle } = await loadFixture(deployEscrowFixture);
    const ORACLE_ROLE = await EscrowContract.ORACLE_ROLE();
    const oracleAddress = await oracle.getAddress();

    // 기존에 ORACLE_ROLE이 있는지 확인
    expect(await EscrowContract.hasRole(ORACLE_ROLE, oracleAddress)).to.be.true;

    await expect(EscrowContract.connect(deployer).revokeRole(ORACLE_ROLE, oracleAddress))
      .to.emit(EscrowContract, "RoleRevoked")
      .withArgs(ORACLE_ROLE, oracleAddress, deployerAddr);

    expect(await EscrowContract.hasRole(ORACLE_ROLE, oracleAddress)).to.be.false;
  });

  it("Should not allow non-admin to grant a role", async function () {
    const { client, nonRoleUser } = await loadFixture(deployEscrowFixture);
    const ORACLE_ROLE = await EscrowContract.ORACLE_ROLE();
    const nonRoleUserAddress = await nonRoleUser.getAddress();

    await expect(EscrowContract.connect(client).grantRole(ORACLE_ROLE, nonRoleUserAddress))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount")
      .withArgs(clientAddr, await EscrowContract.DEFAULT_ADMIN_ROLE());
  });

  it("Should not allow non-admin to revoke a role", async function () {
    const { client, oracle } = await loadFixture(deployEscrowFixture);
    const ORACLE_ROLE = await EscrowContract.ORACLE_ROLE();
    const oracleAddress = await oracle.getAddress();

    await expect(EscrowContract.connect(client).revokeRole(ORACLE_ROLE, oracleAddress))
      .to.be.revertedWithCustomError(EscrowContract, "AccessControlUnauthorizedAccount")
      .withArgs(clientAddr, await EscrowContract.DEFAULT_ADMIN_ROLE());
  });
});