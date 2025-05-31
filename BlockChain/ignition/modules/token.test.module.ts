import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule("MyToken", (m) => {
  const token = m.contract("MyToken", ["ERC20", "KIWI", 31]);
  // m.call(token, "decimals", []);
  return ({ token });
});