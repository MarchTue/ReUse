import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import MyTokenV1 from './MyToken.v1';


export default buildModule("EscrowModule", (m) => {
  const { myToken } = m.useModule(MyTokenV1);
  const autoReleaseDelay: number = 60 * 3;  // 3 분 - test

  const escrow = m.contract("Escrow", [autoReleaseDelay]);

  const oracleAccount = m.getAccount(1);

  m.call(escrow, "grantOracleRole", [oracleAccount]);

  console.log('Escrow Test Ignition Deployment \n', escrow);


  return { myToken, escrow };
});