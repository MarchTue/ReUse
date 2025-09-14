import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import * as dotenv from 'dotenv';
import MyTokenV1 from './MyToken.v1';

dotenv.config();

export default buildModule("TotalModule", (m) => {
  const { myToken } = m.useModule(MyTokenV1);

  const autoReleaseDelay: number = 60 * 60 * 24 * 3; // 3일
  const escrow = m.contract("Escrow", [autoReleaseDelay]);
  const cash = m.contract("Cash", [myToken]);

  const oracleAccountAddress: string =
    process.env.ORACLE_ACCOUNT_ADDRESS || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

  m.call(cash, "addCashAdmin", [oracleAccountAddress]);
  m.call(myToken, "addAdmin", [cash]);
  console.log("Cash Deploy Ignition Deployment (Production Ready):", cash);

  m.call(escrow, "grantOracleRole", [oracleAccountAddress]);
  console.log("Escrow Deploy Ignition Deployment (Production Ready):", escrow);

  return { myToken, escrow, cash };
});
