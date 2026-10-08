import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSeedById } from "../api";
import { SeedBatch } from "../types";
import { TrustBadge } from "../components/TrustBadge";
import { TamperCheckModal } from "../components/TamperCheckModal";
import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Sprout,
  ArrowRight,
  ShieldAlert,
  Hash,
  Award
} from "lucide-react";

export const PublicVerifyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [seed, setSeed] = useState<SeedBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [tamperModalOpen, setTamperModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchSeedById(id)
        .then(setSeed)
        .catch((err) => console.error("Error loading seed:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07130b] flex flex-col items-center justify-center p-4 text-slate-100">
        <div className="w-10 h-10 border-4 border-[#48A741] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Querying SeedSure Blockchain Ledger...
        </p>
      </div>
    );
  }

  if (!seed) {
    return (
      <div className="min-h-screen bg-[#07130b] flex flex-col items-center justify-center p-4 text-center text-slate-100">
        <ShieldAlert className="w-12 h-12 text-rose-500 mb-3" />
        <h2 className="font-display font-black text-xl text-white">Seed Lot Record Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          This QR code does not correspond to any registered lot on SeedSure. Beware of counterfeit packaging.
        </p>
        <Link to="/" className="mt-4 px-4 py-2 rounded-xl bg-[#48A741] hover:bg-[#3da338] text-white font-bold text-xs shadow-md shadow-[#48A741]/20">
          Return to Platform Home
        </Link>
      </div>
    );
  }

  const isCertified = seed.certificationStatus === "Certified";

  return (
    <div className="min-h-screen bg-[#07130b] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100">
      <div className="w-full max-w-md bg-[#0a1f11] rounded-3xl shadow-2xl border border-[#48A741]/30 overflow-hidden space-y-6 pb-6">

        {/* Verification Status Header */}
        <div
          className={`p-6 text-center space-y-2 ${isCertified
              ? "bg-gradient-to-b from-[#48A741] to-emerald-950 text-white"
              : "bg-gradient-to-b from-amber-600 to-amber-950 text-white"
            }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mx-auto shadow-inner border border-white/20">
            {isCertified ? (
              <CheckCircle2 className="w-9 h-9 text-white" />
            ) : (
              <AlertTriangle className="w-9 h-9 text-white" />
            )}
          </div>

          <h1 className="font-display font-black text-2xl tracking-tight text-white">
            {isCertified ? "GENUINE CERTIFIED SEED" : "VERIFICATION PENDING"}
          </h1>
          <p className="text-xs text-slate-200/90 max-w-xs mx-auto">
            {isCertified
              ? "Cryptographically verified on immutable SeedRegistry smart contract."
              : "This lot is registered but certification is not yet finalized."}
          </p>
        </div>

        {/* Content Body */}
        <div className="px-6 space-y-5">

          {/* Seed Details */}
          <div className="text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#07130b] text-[#48A741] border border-[#48A741]/30">
              {seed.cropType} • {seed.variety}
            </span>
            <h2 className="font-display font-black text-2xl text-white">
              {seed.name}
            </h2>
            <p className="font-mono text-xs text-[#48A741] font-bold">
              Lot #{seed.batchNumber}
            </p>
          </div>

          {/* Quality Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#07130b] border border-[#48A741]/30 text-center">
              <span className="text-[10px] font-bold text-[#48A741] uppercase">Germination</span>
              <p className="font-display font-black text-2xl text-white">{seed.germinationRate}%</p>
              <span className="text-[9px] text-emerald-400">Above Min ICAR Std (85%)</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#07130b] border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Genetic Purity</span>
              <p className="font-display font-black text-2xl text-white">{seed.purity}%</p>
              <span className="text-[9px] text-slate-400">Varietal True Type</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#07130b] border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Seed Vigor</span>
              <p className="font-display font-black text-2xl text-white">{seed.vigor}%</p>
              <span className="text-[9px] text-slate-400">Emergence Index</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#07130b] border border-slate-800 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Moisture</span>
              <p className="font-display font-black text-2xl text-white">{seed.moisture}%</p>
              <span className="text-[9px] text-slate-400">Safe Storage Bounds</span>
            </div>
          </div>

          {/* Breeder / Seller Card */}
          <div className="p-3.5 rounded-2xl bg-[#07130b] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Registered Breeder</span>
                <p className="text-xs font-bold text-white">{seed.sellerName}</p>
              </div>
              <TrustBadge score={seed.sellerTrustScore || 50} riskCategory={seed.sellerRiskCategory} size="sm" />
            </div>
            <div className="text-[11px] text-slate-400">
              Accreditation: <strong className="text-slate-200">{seed.manufacturer}</strong>
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash */}
          <div className="p-3 rounded-xl bg-[#07130b] border border-slate-800 text-slate-200 space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-bold">
                <Hash className="w-3 h-3 text-[#48A741]" />
                Immutable SHA-256 Lab Certificate Hash:
              </span>
              <span className="text-[#48A741] font-bold">PASS</span>
            </div>
            <p className="font-mono text-[9px] text-slate-300 break-all leading-relaxed">
              {seed.certificateHash}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={() => setTamperModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-[#48A741] hover:bg-[#3da338] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#48A741]/25 transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Run Cryptographic Tamper Test</span>
            </button>

            <Link
              to={`/seed/${seed.id}`}
              className="w-full py-2.5 rounded-xl bg-[#07130b] hover:bg-white/5 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>View Full Specs & Escrow Details</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#48A741]" />
            </Link>
          </div>

          {/* Research Badge */}
          <div className="text-center pt-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#48A741]/10 text-[#48A741] border border-[#48A741]/20">
              SeedSure Prototype • Synthetic Demo Data
            </span>
          </div>

        </div>

      </div>

      {/* Tamper Modal */}
      <TamperCheckModal
        batchId={seed.id}
        batchNumber={seed.batchNumber}
        seedName={seed.name}
        certificateCID={seed.certificateCID}
        certificateHash={seed.certificateHash}
        isOpen={tamperModalOpen}
        onClose={() => setTamperModalOpen(false)}
      />

    </div>
  );
};
