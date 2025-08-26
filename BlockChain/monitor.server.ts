import express, { Request, Response } from "express";
import { ethers } from "ethers";

import EscrowArt from "./artifacts/contracts/Escrow.sol/Escrow.json";

const app = express();
const PORT = 3001;

// Hardhat RPC 연결
const provider = new ethers.JsonRpcProvider("http://localhost:8545");
const wsProvider = new ethers.WebSocketProvider("ws://localhost:8545");

// 최신 블록 번호
app.get("/latest-block", async (req: Request, res: Response) => {
  try {
    const blockNumber = await provider.getBlockNumber();
    res.json({ latestBlock: blockNumber });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 블록 상세 조회
app.get("/block/:number", async (req: Request, res: Response) => {
  try {
    const blockNumber = parseInt(req.params.number);
    const block = await provider.getBlock(blockNumber);
    res.json(block);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 트랜잭션 조회
app.get("/tx/:hash", async (req: Request, res: Response) => {
  try {
    const tx = await provider.getTransaction(req.params.hash);
    res.json(tx);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/blocks/:start/:end", async (req: Request, res: Response) => {
  try {
    const start = parseInt(req.params.start);
    const end = parseInt(req.params.end);
    const blocks = [];
    for (let i = start; i <= end; i++) {
      const block = await provider.getBlock(i);
      blocks.push(block);
    }
    res.json(blocks);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


async function listenBlocksAndEvents() {
  console.log("🚀 Listening for new blocks and events...");

  // 새 블록 감지
  wsProvider.on("block", async (blockNumber: number) => {
    console.log(`\n🟢 New Block: #${blockNumber}`);
    const block = await wsProvider.getBlock(blockNumber);
    if (!block) return;
    for (const txHash of block.transactions) {
      const tx = await wsProvider.getTransaction(txHash);
      if (!tx) {
        console.log(`  ⚠️ Transaction ${txHash} not found`);
        continue;
      }
      console.log(
        `  txHash: ${tx.hash}, from: ${tx.from}, to: ${tx.to}, value: ${ethers.formatEther(tx.value)} ETH`
      );
    }
  });

  // 스마트 컨트랙트 이벤트 감지 (예: Escrow 컨트랙트) - 주소 확인 필수
  const escrowAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const escrowAbi = EscrowArt.abi;

  // const escrowAbi = [
  //   "event Deposited(address indexed sender, uint256 amount)",
  //   "event Withdrawn(address indexed recipient, uint256 amount)"
  // ];
  const escrowContract = new ethers.Contract(escrowAddress, escrowAbi, wsProvider);

  escrowContract.on("FundsDeposited", (sender, amount, event) => {
    console.log(`💰 FundsDeposited: from ${sender}, amount ${ethers.formatEther(amount)} ETH`);
  });

  escrowContract.on("FundsReleased", (recipient, amount, event) => {
    console.log(`🏦 FundsReleased: to ${recipient}, amount ${ethers.formatEther(amount)} ETH`);
  });

  escrowContract.on("EscrowCreated", (escrowId, seller, buyer, amount, proposalId) => {
    console.log(`🏦ProposalId-${proposalId} & ${escrowId} - EscrowCreated : By ${seller}, to ${buyer}, amount ${amount} `);
  });
}

listenBlocksAndEvents().catch(console.error);

app.listen(PORT, () => {
  console.log(`Hardhat RPC Express server running at http://localhost:${PORT}`);
});
