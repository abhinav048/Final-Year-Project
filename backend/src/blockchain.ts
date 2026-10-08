import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, DEFAULT_ACCOUNTS } from "./contracts.js";

const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";

export interface BlockchainInfo {
  isConnected: boolean;
  rpcUrl: string;
  chainId: number;
  networkName: string;
  blockNumber: number;
  gasPriceGwei: string;
  contracts: Record<string, string>;
  accounts: Record<string, string>;
}

export interface OnChainEvent {
  contractName: string;
  eventName: string;
  blockNumber: number;
  transactionHash: string;
  data: Record<string, any>;
  timestamp: string;
}

// In-memory ledger of on-chain operations and transactions executed in the session
const sessionTransactions: Array<{
  txHash: string;
  blockNumber: number;
  contract: string;
  action: string;
  caller: string;
  details: string;
  timestamp: string;
}> = [
  {
    txHash: "0x4a7e91f0c2bd18a93ef07a9b83b49f82631a9ef27f8045618cdb3974d6423a10",
    blockNumber: 1,
    contract: "SellerRegistry",
    action: "SellerRegistered",
    caller: DEFAULT_ACCOUNTS.seller1,
    details: "AgriGrow Seed Breeders Ltd. registered on-chain",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    txHash: "0x892a0e28f3214b62e49c716298ef9b41a980753b81ef12658ef9c71a3962b401",
    blockNumber: 2,
    contract: "SellerRegistry",
    action: "SellerVerified",
    caller: DEFAULT_ACCOUNTS.certifier,
    details: "Certification Authority verified breeder credentials",
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString()
  },
  {
    txHash: "0x1bc37d890aef9234857b28d098e9451237a8b94017ef8420183bda490281c782",
    blockNumber: 3,
    contract: "TrustScoreRegistry",
    action: "TrustScoreUpdated",
    caller: DEFAULT_ACCOUNTS.oracle,
    details: "ML Dynamic Oracle updated score: 94/100 (Excellent) [featuresHash: 0x93d0...]",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    txHash: "0x6f31289de048291a823b4971c29497e01f28b74a98102394857c09128f9a451e",
    blockNumber: 4,
    contract: "SeedRegistry",
    action: "BatchRegistered & BatchCertified",
    caller: DEFAULT_ACCOUNTS.certifier,
    details: "Wheat HD-2967 certified on-chain with SHA-256 certificate hash",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

export function getProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(RPC_URL);
}

export async function getBlockchainStatus(): Promise<BlockchainInfo> {
  try {
    const provider = getProvider();
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const feeData = await provider.getFeeData();
    const gasPriceGwei = feeData.gasPrice ? (Number(feeData.gasPrice) / 1e9).toFixed(2) : "1.25";

    return {
      isConnected: true,
      rpcUrl: RPC_URL,
      chainId: Number(network.chainId),
      networkName: `Local Ethereum Node (Chain ${network.chainId})`,
      blockNumber,
      gasPriceGwei,
      contracts: CONTRACT_ADDRESSES,
      accounts: DEFAULT_ACCOUNTS
    };
  } catch (err) {
    return {
      isConnected: false,
      rpcUrl: RPC_URL,
      chainId: 31337,
      networkName: "Ethereum EVM Ready (Local)",
      blockNumber: 4 + sessionTransactions.length,
      gasPriceGwei: "1.25",
      contracts: CONTRACT_ADDRESSES,
      accounts: DEFAULT_ACCOUNTS
    };
  }
}

export function recordSessionTransaction(
  contract: string,
  action: string,
  caller: string,
  details: string
) {
  const randomHex = ethers.hexlify(ethers.randomBytes(32));
  const newTx = {
    txHash: randomHex,
    blockNumber: sessionTransactions.length + 5,
    contract,
    action,
    caller,
    details,
    timestamp: new Date().toISOString()
  };
  sessionTransactions.unshift(newTx);
  return newTx;
}

export function getSessionTransactions() {
  return sessionTransactions;
}

/**
 * Direct call to SeedRegistry to verify certificate hash
 */
export async function verifyCertificateHashOnChain(batchId: number, testHash: string) {
  try {
    const provider = getProvider();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESSES.seedRegistry,
      CONTRACT_ABIS.SeedRegistry,
      provider
    );
    const [isValid, isCertified] = await contract.verifyBatch(batchId, testHash);
    return { isLiveNode: true, isValid, isCertified };
  } catch (err: any) {
    return { isLiveNode: false, error: err.message };
  }
}
