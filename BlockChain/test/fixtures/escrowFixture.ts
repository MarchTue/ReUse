import { ethers } from "hardhat";
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { MyToken, Escrow } from '../../typechain-types/contracts/';

export let MyTokenContract: MyToken;
export let EscrowContract: Escrow;
export let deployer: SignerWithAddress;
export let client: SignerWithAddress;
export let seller: SignerWithAddress;
export let oracle: SignerWithAddress;
export let arbiter: SignerWithAddress;
export let nonRoleUser: SignerWithAddress;

export const initialMyTokenSupply: bigint = ethers.parseUnits("1000000", 0);
export const autoReleaseDelay = 60 * 5; // 5분
export const escrowAmount: bigint = ethers.parseUnits('1000', 0);
export const proposalId = ethers.keccak256(ethers.toUtf8Bytes("PROPOSAL_14"));
export const proposalId2 = ethers.keccak256(ethers.toUtf8Bytes("PROPOSAL_24"));
export const disputeId = ethers.keccak256(ethers.toUtf8Bytes("DISPUTE_01"));


export async function deployEscrowFixture() {
  [deployer, client, seller, oracle, arbiter, nonRoleUser] = await ethers.getSigners();

  const MyTokenFactory = await ethers.getContractFactory("MyToken");
  MyTokenContract = await MyTokenFactory.connect(deployer).deploy("ReUseToken", "RUT", initialMyTokenSupply);
  await MyTokenContract.waitForDeployment();

  const EscrowFactory = await ethers.getContractFactory("Escrow");
  EscrowContract = await EscrowFactory.connect(deployer).deploy(autoReleaseDelay);
  await EscrowContract.waitForDeployment();

  await EscrowContract.connect(deployer).grantRole(await EscrowContract.ORACLE_ROLE(), await oracle.getAddress());
  await EscrowContract.connect(deployer).grantRole(await EscrowContract.ARBITER_ROLE(), await arbiter.getAddress());

  await MyTokenContract.connect(deployer).transfer(await client.getAddress(), escrowAmount * 10n);

  return { MyTokenContract, EscrowContract, deployer, client, seller, oracle, arbiter, nonRoleUser, initialMyTokenSupply, escrowAmount, proposalId, proposalId2, disputeId };
}