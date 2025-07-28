import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import MyTokenV1 from './MyToken.v1';


export default buildModule("EscrowModule", (m) => {
  const { myToken } = m.useModule(MyTokenV1);
  const autoReleaseDelay: number = 60 * 60 * 24 * 3; // 3일

  const escrow = m.contract("Escrow", [autoReleaseDelay]);


  const oracleAccountAddress: string = process.env.ORACLE_ACCOUNT_ADDRESS || "";
  const oracleAccount = m.getParameter(oracleAccountAddress);

  m.call(escrow, 'grantOracleRole', [oracleAccount]);

  console.log('Escrow Deploy Ignition Deployment (Production Ready)\n', escrow);

  return { myToken, escrow };
});