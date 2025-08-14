import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { ethers } from 'hardhat';

interface MyTokenModuleResults {
  myToken: any;
}

export default buildModule("MyTokenModule", (m) => {
  const tokenName = "ReUseToken";
  const tokenSymbol = "RU";
  const initialSupply: bigint = ethers.parseUnits("1000000", 0);


  const myToken = m.contract("MyToken", [tokenName, tokenSymbol, initialSupply]);

  console.log('myToken V1 Ignition Deployment \n', myToken);

  return { myToken };
});