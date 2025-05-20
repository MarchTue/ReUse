import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";


describe("MyToken", function () {
  async function deployMyTokenFixture() {
    // Address setup
    const [owner, addr1, addr2] = await hre.ethers.getSigners();

    const initialSupply = 1234;
    const name = "MarchTue";
    const symbol = "KIWI";
    const MyTokenContractFactory = await hre.ethers.getContractFactory("MyToken");

    // Deploy the contract
    const myToken = await MyTokenContractFactory.deploy(name, symbol, initialSupply);

    await myToken.waitForDeployment();

    // Contract address
    const myTokenAddress = await myToken.getAddress();

    return { myToken, owner, addr1, addr2, name, symbol, initialSupply, myTokenAddress };
  };

  describe("DeployMent", function () {
    it("Should set the right name, symbol and initial supply", async function () {

      const { myToken, name, symbol, initialSupply, owner } = await loadFixture(deployMyTokenFixture);
      expect(await myToken.name()).to.equal(name);
      expect(await myToken.symbol()).to.equal(symbol);
      expect(await myToken.decimals()).to.equal(0);

      expect(await myToken.balanceOf(owner.address)).to.equal(initialSupply);
    });

    it("Sould emit a Minted event on Initial supply deployment", async function () {
      const { owner, name, symbol, initialSupply } = await loadFixture(deployMyTokenFixture);
      const MyTokenContractFactory = await hre.ethers.getContractFactory("MyToken");

      const deployedContract = await MyTokenContractFactory.deploy(name, symbol, initialSupply);
      const deployTx = await deployedContract.deploymentTransaction();

      await expect(deployTx)
        .to.emit(deployedContract, "Minted")
        .withArgs(owner.address, initialSupply);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts and emit Transfer event", async function () {
      const { myToken, owner, name, symbol, addr1, addr2, initialSupply } = await loadFixture(deployMyTokenFixture);

      const transferAmount = 234;

      await expect(myToken.connect(owner).transfer(addr1.address, transferAmount))
        .to.emit(myToken, "Transfer")
        .withArgs(owner.address, addr1.address, transferAmount);

      expect(await myToken.balanceOf(addr1.address)).to.equal(transferAmount);
      expect(await myToken.balanceOf(owner.address)).to.equal(initialSupply - transferAmount);
    });
  });
  
});