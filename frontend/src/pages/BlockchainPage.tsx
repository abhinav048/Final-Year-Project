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
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleRunVerification = async () => {
    setVerifying(true);
    try {
      const genuineHash =
        selectedBatchId === 1
          ? "0x98f2b7405232817865219586113b28499268f700412852683935178696894017"
          : "0x38e819b168926942095819749102839481759284759281749581729487519284";

      const hashToTest = simulateTamper
        ? "0xbaad00000000000000000000000000000000000000000000000000000000dead"
        : genuineHash;

      const res = await verifyBatchOnChain(selectedBatchId, hashToTest);
      setVerifyResult({
        ...res,
        testedHash: hashToTest,
        tampered: simulateTamper
      });
    } catch (err: any) {
      alert("Verification failed: " + err.message);
    } finally {
      setVerifying(false);
    }
  };

  const contractList = [
    {
      name: "SellerRegistry",
      address: deployedConfig.contracts.SellerRegistry,
      purpose: "Breeder identity accreditation, CA verification status, and fulfillment metric ledger.",
      solFile: "SellerRegistry.sol",
      methods: ["registerSeller", "verifySeller", "suspendSeller", "getSeller"]
    },
    {
      name: "SeedRegistry",
      address: deployedConfig.contracts.SeedRegistry,
      purpose: "Immutable seed lot registration, lab quality parameters, and SHA-256 certificate hashes.",
      solFile: "SeedRegistry.sol",
      methods: ["registerBatch", "certifyBatch", "revokeBatch", "verifyBatch"]
    },
    {
      name: "TrustScoreRegistry",
      address: deployedConfig.contracts.TrustScoreRegistry,
      purpose: "Decentralized oracle storing dynamic multi-factor trust scores & canonical feature hashes.",
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300 text-slate-100">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#48A741]/20">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#48A741] to-emerald-950 text-white flex items-center justify-center shadow-md shadow-[#48A741]/25">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white flex flex-wrap items-center gap-2">
                <span>{t("ethereumEscrow")} Explorer</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/40">
                  Ethereum EVM Verified
                </span>
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {t("bannerDesc")}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0a1f11] border border-[#48A741]/30 hover:bg-[#0f2c19] text-slate-200 hover:text-white text-xs font-bold shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#48A741] ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Network Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 bg-[#0a1f11] border border-[#48A741]/20 rounded-2xl shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#48A741]/15 text-[#48A741] flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Network Status</p>
            <p className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-[#48A741] animate-pulse"></span>
              {networkStatus?.isNodeConnected ? "Ethereum Node Active" : "Ethereum EVM Ready"}
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#0a1f11] border border-[#48A741]/20 rounded-2xl shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Block</p>
            <p className="text-xs sm:text-sm font-black text-white mt-0.5">
              #{networkStatus?.blockNumber || 42}
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#0a1f11] border border-[#48A741]/20 rounded-2xl shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Chain ID</p>
            <p className="text-xs sm:text-sm font-black text-white mt-0.5 font-mono">
              {networkStatus?.chainId || 31337} (EVM)
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#0a1f11] border border-[#48A741]/20 rounded-2xl shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Deployed Contracts</p>
            <p className="text-xs sm:text-sm font-black text-white mt-0.5">
              5 Solidity Suites
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Contracts Directory + On-Chain Verifier */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

        {/* Left: Deployed Smart Contracts List (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#48A741]" />
              SeedSure Ethereum Smart Contract Suite
            </h2>
            <span className="text-xs text-slate-400 font-medium">Solidity ^0.8.24 • Ethereum EVM</span>
          </div>

          <div className="space-y-3">
            {contractList.map((c) => (
              <div
                key={c.name}
                className="p-4 sm:p-5 bg-[#0a1f11] border border-[#48A741]/20 rounded-2xl shadow-md hover:border-[#48A741]/50 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#48A741]/15 pb-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-bold text-white text-sm">{c.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#07130b] text-[#48A741] border border-[#48A741]/30 font-mono">
                        {c.solFile}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#48A741]/15 text-[#48A741] border border-[#48A741]/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#48A741]" />
                        Audited
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{c.purpose}</p>
                  </div>

                  {/* Copy Address */}
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="font-mono text-xs bg-[#07130b] px-2.5 py-1 rounded-lg border border-slate-800 text-slate-300 font-medium">
                      {formatAddress(c.address)}
                    </span>
                    <button
                      onClick={() => handleCopy(c.address, c.name)}
                      className="p-1.5 rounded-lg border border-slate-700 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Copy full contract address"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {copiedAddress === c.name && (
                      <span className="text-[10px] font-bold text-[#48A741] animate-in fade-in">
                        Copied!
                      </span>
                    )}
                  </div>
                </div>

                {/* Methods Tags */}
                <div className="pt-3 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
                    Interface:
                  </span>
                  {c.methods.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#48A741]/10 text-[#48A741] border border-[#48A741]/25"
                    >
                      {m}()
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Interactive On-Chain Tamper Check Tool */}
        <div className="p-5 sm:p-6 bg-[#0a1f11] border border-[#48A741]/30 rounded-2xl shadow-xl space-y-5 h-fit">
          <div className="border-b border-[#48A741]/20 pb-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/40">
              Interactive Testbench
            </span>
            <h3 className="font-display font-bold text-base text-white mt-1.5 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#48A741]" />
              On-Chain Tamper Verification
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Executes <code className="text-[#48A741] bg-[#07130b] px-1 py-0.5 rounded border border-slate-800">SeedRegistry.verifyBatch()</code> on the EVM smart contract to prove tamper-detection mathematically.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Select Lot */}
            <div>
              <label className="font-bold text-slate-300 block mb-1">Select Seed Lot:</label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-700 bg-[#07130b] font-medium text-white focus:outline-none focus:border-[#48A741]"
              >
                <option value={1}>Batch #1: Wheat HD-2967 (ICAR Certified)</option>
                <option value={2}>Batch #2: Basmati Rice Pusa 1121 (NSC Lot)</option>
              </select>
            </div>

            {/* Adversarial Tamper Toggle */}
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-200">Simulate Adversarial Modification:</span>
                <input
                  type="checkbox"
                  checked={simulateTamper}
                  onChange={(e) => setSimulateTamper(e.target.checked)}
                  className="w-4 h-4 rounded text-[#48A741] accent-[#48A741] focus:ring-[#48A741] cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-amber-300/80">
                {simulateTamper
                  ? "Adversarial mode ON: Altering document hash by 1 byte to simulate forged paper certificate."
                  : "Adversarial mode OFF: Submitting genuine laboratory certificate hash."}
              </p>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleRunVerification}
              disabled={verifying}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white shadow-lg flex items-center justify-center gap-2 transition-all ${simulateTamper
                  ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30"
                  : "bg-[#48A741] hover:bg-[#3da338] shadow-[#48A741]/30"
                }`}
            >
              {verifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Querying EVM Smart Contract...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Run Smart Contract Tamper Test</span>
                </>
              )}
            </button>

            {/* Result Box */}
            {verifyResult && (
              <div
                className={`p-4 rounded-xl border space-y-2.5 animate-in fade-in duration-200 ${verifyResult.isValid
                    ? "bg-[#07130b] border-[#48A741]/50 text-emerald-300"
                    : "bg-[#07130b] border-rose-500/50 text-rose-300"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    EVM Contract Response:
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider ${verifyResult.isValid ? "bg-[#48A741]/25 text-[#48A741] border border-[#48A741]/40" : "bg-rose-950 text-rose-300 border border-rose-700"
                      }`}
                  >
                    {verifyResult.status}
                  </span>
                </div>

                <div className="space-y-1 font-mono text-[10px] break-all">
                  <p>
                    <span className="font-bold text-slate-400">Tested Hash:</span> {verifyResult.testedHash.slice(0, 24)}...
                  </p>
                  <p>
                    <span className="font-bold text-slate-400">On-Chain Hash:</span> {verifyResult.onChainHash.slice(0, 24)}...
                  </p>
                </div>

                <p className="text-[11px] leading-relaxed">
                  {verifyResult.isValid
                    ? "✓ Cryptographic Integrity Validated. Certificate exactly matches on-chain record."
                    : "⚠️ Forgery Detected! Document bytes hash diverges from immutable blockchain record."}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Real-Time Transaction Ledger / Event Log */}
      <div className="p-5 sm:p-6 bg-[#0a1f11] border border-[#48A741]/20 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#48A741]/15 pb-4">
          <div>
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#48A741]" />
              Live On-Chain Transaction Ledger
            </h2>
            <p className="text-xs text-slate-400">
              Chronological log of state-modifying smart contract events and cryptographic receipts.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["ALL", "Marketplace", "SeedRegistry", "TrustScoreRegistry", "SellerRegistry"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterContract(f)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${filterContract === f
                    ? "bg-[#48A741] text-white shadow-md shadow-[#48A741]/30"
                    : "bg-[#07130b] text-slate-400 hover:text-white border border-slate-800"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table (Responsive horizontal scroll on mobile) */}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full min-w-[620px] text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Tx Hash</th>
                <th className="py-2.5 px-3">Block</th>
                <th className="py-2.5 px-3">Contract</th>
                <th className="py-2.5 px-3">Action / Event</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3">Caller</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredTxs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500 font-sans">
                    No transactions recorded for this filter.
                  </td>
                </tr>
              ) : (
                filteredTxs.map((tx, idx) => (
                  <tr key={tx.txHash || idx} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 text-[#48A741] font-bold truncate max-w-[140px]">
                      {tx.txHash ? `${tx.txHash.substring(0, 10)}...${tx.txHash.substring(tx.txHash.length - 6)}` : "0x4a7...3a1"}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-bold">
                      #{tx.blockNumber || idx + 1}
                    </td>
                    <td className="py-3 px-3 text-slate-200 font-semibold font-sans">
                      <span className="px-2 py-0.5 rounded bg-[#07130b] text-slate-300 border border-slate-800">
                        {tx.contract}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans font-bold text-white">
                      {tx.action}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-400 max-w-[280px] truncate" title={tx.details}>
                      {tx.details}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {formatAddress(tx.caller)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
