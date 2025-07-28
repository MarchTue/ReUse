import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { MyToken } from "../typechain-types/contracts";
import { BigNumberish } from "ethers";
import { ethers } from "hardhat";

/**
 * @description EIP-712 permit 서명을 위한 도메인 정의 헬퍼
 */
export async function getPermitSignature(
  signer: SignerWithAddress,
  token: MyToken,
  spender: string,
  value: BigNumberish,
  deadline: BigNumberish
) {
  const domain = {
    name: await token.name(),
    version: "1",
    chainId: (await ethers.provider.getNetwork()).chainId,
    verifyingContract: await token.getAddress()
  };

  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const nonce = await token.nonces(await signer.getAddress());

  const message = {
    owner: await signer.getAddress(),
    spender: spender,
    value: value,
    nonce: nonce,
    deadline: deadline,
  };

  const signature = await ethers.provider.send('eth_signTypedData_v4', [
    await signer.getAddress(),
    JSON.stringify({
      types: types,
      domain: domain,
      primaryType: "Permit",
      message: message
    }, (key, value) => {
      return typeof value === 'bigint' ? value.toString() : value;
    })
  ]);

  // V, R, S 값 분리
  return ethers.Signature.from(signature);

}