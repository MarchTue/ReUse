import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule("MyToken", (m) => {
  const token = m.contract("MyToken", ["ERC20", "KIWI", 10]);
  m.call(token, "decimals", []);
  
  return ({ token });
}); 