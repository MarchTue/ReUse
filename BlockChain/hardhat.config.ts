import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


import { vars } from "hardhat/config";

// const INFURA_KEY = vars.get("INFURA_KEY");
const MY_ACCOUNT = vars.get("MY_ACCOUNT");
const HOLESKY_URL_VAR = vars.get("HOLESKY_URL");

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    holesky: {
      url: HOLESKY_URL_VAR,
      chainId: 17000,
      accounts: [`0x${MY_ACCOUNT}`],
    }
  }
};

export default config;
