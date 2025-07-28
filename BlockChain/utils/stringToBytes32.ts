import { ethers } from "hardhat";

export default function stringToBytes32(str: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(str));
}