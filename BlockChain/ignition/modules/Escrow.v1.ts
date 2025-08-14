import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import MyTokenV1 from './MyToken.v1';
import dotenv from 'dotenv';


dotenv.config();

export default buildModule("EscrowModule", (m) => {
  const { myToken } = m.useModule(MyTokenV1);
  const autoReleaseDelay: number = 60 * 60 * 24 * 3; // 3일

  const escrow = m.contract("Escrow", [autoReleaseDelay]);


  const oracleAccountAddress: string = process.env.ORACLE_ACCOUNT_ADDRESS || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  // const oracleAccount = m.getParameter(oracleAccountAddress);

  // m.call(escrow, 'grantOracleRole', [oracleAccount]);
  m.call(escrow, 'grantOracleRole', [oracleAccountAddress]);

  console.log('Escrow Deploy Ignition Deployment (Production Ready)\n', escrow);

  return { myToken, escrow };
});