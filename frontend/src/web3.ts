import { ethers } from "ethers";

// Known demo accounts
export const DEMO_ROLES = [
  {
    role: "Farmer (Buyer)",
    address: "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    description: "Purchases certified seed with smart escrow protection, confirms delivery, and provides feedback."
  },
  {
    role: "Seller (Breeder)",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    description: "Registers seed batches, uploads lab certificates to IPFS, ships orders, tracks trust score."
  },
  {
    role: "CA / Certifier",
    address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    description: "Official seed certification agency inspecting test parameters, certifying, or revoking lots."
  },
  {
    role: "Platform Admin",
    address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    description: "Configures trust thresholds, arbitrates escrow disputes, governs smart contracts."
  }
];

export interface Web3State {
  isConnected: boolean;
  address: string;
  shortAddress: string;
  chainId: number | null;
  networkName: string;
  isMetaMask: boolean;
  isDemoMode: boolean;
  activeRole: string;
}

export async function connectMetaMask(): Promise<{ address: string; chainId: number }> {
  if (typeof window !== "undefined" && (window as any).ethereum) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();
    return {
      address: accounts[0],
      chainId: Number(network.chainId)
    };
  } else {
    throw new Error("MetaMask is not installed. Using simulated demo account.");
  }
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address || "";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function getNetworkLabel(chainId: number | null): string {
  if (!chainId) return "Ethereum Local (Simulated)";
  if (chainId === 31337) return "Ethereum Local Node (Chain 31337)";
  if (chainId === 11155111) return "Ethereum Sepolia Testnet";
  if (chainId === 1) return "Ethereum Mainnet";
  return `Ethereum (Chain ${chainId})`;
}

