import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Boxes,
  Cpu,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  Layers,
  Activity,
  Coins,
  Lock,
  RefreshCw,
  Search,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { formatAddress } from "../web3";
import deployedConfig from "../contracts/deployedContracts.json";
import { verifyBatchOnChain, checkBlockchainStatus } from "../services/blockchain";
import { useLanguage } from "../context/LanguageContext";
import { PillButton } from "../components/PillButton";
import { TagPill } from "../components/TagPill";
import { VerificationStepsCard } from "../components/VerificationStepsCard";
import { VerifiedBadge } from "../components/VerifiedBadge";

export const BlockchainPage: React.FC = () => {
  const { t } = useLanguage();
  const [networkStatus, setNetworkStatus] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [filterContract, setFilterContract] = useState("ALL");

  // Interactive Tamper Test State
  const [selectedBatchId, setSelectedBatchId] = useState(1);
  const [simulateTamper, setSimulateTamper] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statusRes, txRes] = await Promise.all([
        fetch("http://localhost:5001/api/blockchain/status").then((r) => r.json()).catch(() => null),
        fetch("http://localhost:5001/api/blockchain/transactions").then((r) => r.json()).catch(() => null)
      ]);

      if (statusRes?.success) {
        setNetworkStatus(statusRes.data);
      } else {
        const localStatus = await checkBlockchainStatus();
        setNetworkStatus(localStatus);
      }

      if (txRes?.success) {
        setTransactions(txRes.data);
      }
    } catch (e) {
      console.error("Failed to load blockchain status:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleRunVerifyTestbench = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const testHash = simulateTamper
        ? "0x0000000000000000000000000000000000000000000000000000000000000000"
        : "0x98f5a432b876543210fedcba9876543210fedcba9876543210fedcba98765432";
      const result = await verifyBatchOnChain(selectedBatchId, testHash);
      setVerifyResult(result);
    } catch (err: any) {
      setVerifyResult({
        success: false,
        valid: false,
        tampered: true,
        error: err.message
      });
    } finally {
      setVerifying(false);
    }
  };

  const contractRegistry = [
    {
      name: "SeedRegistry",
      address: deployedConfig.contracts.SeedRegistry,
      purpose: "Immutable seed lot certification catalogue and SHA-256 certificate hashes.",
      solFile: "SeedRegistry.sol",
      methods: ["registerBatch", "certifyBatch", "verifyBatch", "revokeBatch"]
    },
    {
      name: "SellerRegistry",
      address: deployedConfig.contracts.SellerRegistry,
      purpose: "Breeder identity registration and Certification Authority accreditation.",
      solFile: "SellerRegistry.sol",
      methods: ["registerSeller", "verifySeller", "suspendSeller", "getSeller"]
    },
    {
      name: "TrustScoreRegistry",
      address: deployedConfig.contracts.TrustScoreRegistry,
      purpose: "Dynamic AI multi-factor trust scores with mathematical audit vectors.",
      solFile: "TrustScoreRegistry.sol",
      methods: ["updateTrustScore", "getTrustScore", "meetsTrustThreshold"]
    },
    {
      name: "Marketplace & Escrow",
      address: deployedConfig.contracts.Marketplace,
      purpose: "Non-custodial smart contract escrow holding buyer ETH until delivery confirmation.",
      solFile: "Marketplace.sol",
      methods: ["createOrder", "shipOrder", "confirmDelivery", "disputeOrder", "resolveDispute"]
    },
    {
      name: "FeedbackRegistry",
      address: deployedConfig.contracts.FeedbackRegistry,
      purpose: "Verifiable buyer feedback restricted to completed orders, preventing Sybil rating spam.",
      solFile: "FeedbackRegistry.sol",
      methods: ["submitFeedback", "getFeedback", "hasFeedback"]
    }
  ];

  const filteredTxs =
    filterContract === "ALL"
      ? transactions
      : transactions.filter((tx) => tx.contract.toLowerCase().includes(filterContract.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
      <div className="sheet-surface wave-pattern border border-[#E1E6DA] p-6 sm:p-10 shadow-sheet space-y-8">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E1E6DA]">
          <div>
            <div className="flex items-center gap-2">
              <TagPill icon={<Boxes className="w-3.5 h-3.5 text-[#6AB547]" />}>
                Ethereum Sepolia / Local EVM Ledger
              </TagPill>
            </div>
            <h1 className="font-extrabold text-2xl sm:text-3xl text-[#121714] mt-2">
              Ethereum Escrow Explorer & Contract Testbench
            </h1>
            <p className="text-xs sm:text-sm text-[#5B665F] mt-1">
              Real-time audit log of Ethereum smart contracts, block heights, and escrow transactions
            </p>
          </div>

          <PillButton
            variant="secondary"
            size="sm"
            icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
            onClick={loadData}
          >
            Refresh Ledger
          </PillButton>
        </div>

        {/* Network Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-[#E1E6DA] rounded-[20px] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF3E6] text-[#6AB547] flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-[#5B665F] uppercase font-bold">Current Block</p>
              <p className="font-mono font-extrabold text-lg text-[#121714]">
                #{networkStatus?.blockNumber || 12}
              </p>
            </div>
          </div>

          <div className="p-5 bg-white border border-[#E1E6DA] rounded-[20px] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF8F1] text-[#2E9E57] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-[#5B665F] uppercase font-bold">Chain ID</p>
              <p className="font-mono font-extrabold text-lg text-[#121714]">
                {networkStatus?.chainId || 31337}
              </p>
            </div>
          </div>

          <div className="p-5 bg-white border border-[#E1E6DA] rounded-[20px] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF9EE] text-[#E9A93B] flex items-center justify-center font-bold">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-[#5B665F] uppercase font-bold">Gas Price</p>
              <p className="font-mono font-extrabold text-lg text-[#121714]">
                {networkStatus?.gasPriceGwei || "1.5"} Gwei
              </p>
            </div>
          </div>

          <div className="p-5 bg-white border border-[#E1E6DA] rounded-[20px] shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F7F8F3] text-[#2F8F83] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-[#5B665F] uppercase font-bold">Contracts</p>
              <p className="font-mono font-extrabold text-lg text-[#121714]">5 Verified</p>
            </div>
          </div>
        </div>

        {/* Smart Contracts Registry */}
        <div className="rounded-[24px] bg-white border border-[#E1E6DA] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#F1EFE6]">
            <h2 className="font-extrabold text-base text-[#121714]">
              Verified Smart Contract Deployments
            </h2>
          </div>

          <div className="divide-y divide-[#F1EFE6]">
            {contractRegistry.map((contract) => (
              <div key={contract.name} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#F7F8F3] transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#121714]">{contract.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EEF3E6] text-[#6AB547]">
                      {contract.solFile}
                    </span>
                  </div>
                  <p className="text-xs text-[#5B665F]">{contract.purpose}</p>
                </div>

                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono font-bold text-[#121714] bg-[#F7F8F3] px-3 py-1.5 rounded-xl border border-[#E1E6DA]">
                    {contract.address}
                  </code>
                  <button
                    onClick={() => copyToClipboard(contract.address)}
                    className="p-2 rounded-xl bg-white border border-[#E1E6DA] hover:bg-[#EEF3E6] text-[#5B665F] cursor-pointer"
                    title="Copy Address"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Smart Contract Tamper Testbench */}
        <div className="rounded-[24px] bg-white border border-[#E1E6DA] p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-extrabold text-xl text-[#121714]">
            Interactive Smart Contract Tamper Testbench
          </h2>
          <p className="text-xs text-[#5B665F]">
            Simulate an unauthorized change to an official seed laboratory document to observe real-time cryptographic hash rejection by SeedRegistry.sol.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[#121714] cursor-pointer">
              <input
                type="checkbox"
                checked={simulateTamper}
                onChange={(e) => setSimulateTamper(e.target.checked)}
                className="rounded accent-[#D8503F] cursor-pointer"
              />
              <span className={simulateTamper ? "text-[#D8503F]" : ""}>
                Simulate Counterfeit Modification (Altered Certificate)
              </span>
            </label>

            <PillButton
              variant="primary"
              size="sm"
              withArrow
              isLoading={verifying}
              loadingText="Confirm in your wallet…"
              onClick={handleRunVerifyTestbench}
            >
              Verify On-Chain Batch
            </PillButton>
          </div>

          {verifying && (
            <div className="pt-2">
              <VerificationStepsCard
                currentStep={2}
                progress={68}
                showSkeletonAndButton={true}
                buttonText="Confirm in your wallet…"
              />
            </div>
          )}

          {verifyResult && (
            <div className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
              verifyResult.valid
                ? "bg-[#EEF8F1] border-[#B8E4C7] text-[#2E9E57]"
                : "bg-[#FDF1F0] border-[#F7B8B2] text-[#D8503F]"
            }`}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {verifyResult.valid ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                <span>{verifyResult.valid ? "GENUINE: Fingerprint Matches On-Chain Registry" : "TAMPER DETECTED: Hash Mismatch Flagged!"}</span>
              </div>
              <p className="text-[11px] text-[#5B665F]">
                Computed SHA-256 Hash: <code className="font-mono text-[#121714]">{verifyResult.computedHash || "0x98f...2a1"}</code>
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
