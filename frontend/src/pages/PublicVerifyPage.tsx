import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchSeedById } from "../api";
import { SeedBatch } from "../types";
import { TrustBadge } from "../components/TrustBadge";
import { TamperCheckModal } from "../components/TamperCheckModal";
import { PillButton } from "../components/PillButton";
import { TagPill } from "../components/TagPill";
import { VerifiedBadge } from "../components/VerifiedBadge";
import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Sprout,
  ArrowRight,
  ShieldAlert,
  Hash,
  Award,
  ExternalLink,
  Share2,
  Lock
} from "lucide-react";

export const PublicVerifyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [seed, setSeed] = useState<SeedBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [tamperModalOpen, setTamperModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchSeedById(id)
        .then(setSeed)
        .catch((err) => console.error("Error loading seed:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-white rounded-[28px] border border-[#E1E6DA] shadow-sheet">
        <div className="w-10 h-10 border-3 border-[#6AB547] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#5B665F] font-bold uppercase tracking-wider">
          Querying SeedSure Blockchain Ledger...
        </p>
      </div>
    );
  }

  if (!seed) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 text-center bg-[#FDF1F0] rounded-[28px] border border-[#F7B8B2] shadow-sheet">
        <ShieldAlert className="w-12 h-12 text-[#D8503F] mx-auto mb-3" />
        <h2 className="font-black text-xl text-[#D8503F]">
          Seed Lot Record Not Found
        </h2>
        <p className="text-xs text-[#5B665F] max-w-sm mt-1 mx-auto leading-relaxed">
          This QR code does not correspond to any registered lot on SeedSure. Beware of counterfeit or untracked packaging.
        </p>
        <div className="mt-4">
          <Link to="/">
            <PillButton variant="primary" size="sm">
              Return to Platform Home
            </PillButton>
          </Link>
        </div>
      </div>
    );
  }

  const isCertified = seed.certificationStatus === "Certified";

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="sheet-surface border border-[#E1E6DA] rounded-[28px] overflow-hidden shadow-sheet bg-white">
        {/* Verification Status Header: Big PASS / PENDING result (§11.6) */}
        <div
          className={`p-6 sm:p-8 text-center space-y-2 border-b ${isCertified
              ? "bg-[#EEF8F1] border-[#B8E4C7] text-[#2E9E57]"
              : "bg-[#FEF9EE] border-[#FADFA8] text-[#E9A93B]"
            }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 shadow-xs ${isCertified ? "bg-[#2E9E57] text-white" : "bg-[#E9A93B] text-white"
              }`}
          >
            {isCertified ? (
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            ) : (
              <AlertTriangle className="w-10 h-10 stroke-[2.5]" />
            )}
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest block">
            Official Seed Quality Verification Result
          </span>

          <h1 className="font-extrabold text-2xl sm:text-3xl tracking-tight text-[#121714]">
            {isCertified ? "GENUINE CERTIFIED SEED" : "VERIFICATION PENDING"}
          </h1>
          <p className="text-xs text-[#5B665F] max-w-xs mx-auto leading-relaxed">
            {isCertified
              ? "Cryptographically validated on immutable SeedRegistry smart contract."
              : "This lot is registered but certification is not yet finalized."}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Seed Details */}
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#EEF3E6] text-[#6AB547]">
              {seed.cropType} • {seed.variety}
            </span>
            <h2 className="font-black text-2xl text-[#121714] mt-2">
              {seed.name}
            </h2>
            <p className="font-mono text-xs text-[#5B665F]">
              Lot #{seed.batchNumber}
            </p>
          </div>

          {/* Quality Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#EEF3E6] border border-[#D2ECC3] text-center">
              <span className="text-[10px] font-bold text-[#6AB547] uppercase">
                Germination
              </span>
              <p className="font-black text-2xl text-[#121714]">
                {seed.germinationRate}%
              </p>
              <span className="text-[10px] text-[#2E9E57] font-semibold">
                Above ICAR Baseline (85%)
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F7F8F3] border border-[#E1E6DA] text-center">
              <span className="text-[10px] font-bold text-[#5B665F] uppercase">
                Genetic Purity
              </span>
              <p className="font-black text-2xl text-[#121714]">
                {seed.purity}%
              </p>
              <span className="text-[10px] text-[#5B665F]">
                Varietal True Type
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F7F8F3] border border-[#E1E6DA] text-center">
              <span className="text-[10px] font-bold text-[#5B665F] uppercase">
                Seed Vigor
              </span>
              <p className="font-black text-2xl text-[#121714]">
                {seed.vigor}%
              </p>
              <span className="text-[10px] text-[#5B665F]">
                Emergence Index
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F7F8F3] border border-[#E1E6DA] text-center">
              <span className="text-[10px] font-bold text-[#5B665F] uppercase">
                Safe Moisture
              </span>
              <p className="font-black text-2xl text-[#121714]">
                {seed.moisture}%
              </p>
              <span className="text-[10px] text-[#5B665F]">
                Storage Bounds
              </span>
            </div>
          </div>

          {/* Breeder Card */}
          <div className="p-4 rounded-2xl bg-[#F7F8F3] border border-[#E1E6DA] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#5B665F] uppercase font-bold">
                Registered Breeder
              </span>
              <p className="text-xs font-bold text-[#121714]">
                {seed.sellerName}
              </p>
            </div>
            <TrustBadge
              score={seed.sellerTrustScore || 50}
              riskCategory={seed.sellerRiskCategory}
              size="sm"
            />
          </div>

          {/* Tamper Check Button */}
          <div className="pt-2">
            <PillButton
              variant="dark"
              size="md"
              withArrow
              className="w-full"
              onClick={() => setTamperModalOpen(true)}
            >
              Test SHA-256 Tamper Security
            </PillButton>
          </div>

          {/* Share & Traceability Info */}
          <div className="pt-4 border-t border-[#F1EFE6] flex items-center justify-between text-xs text-[#5B665F]">
            <button
              onClick={handleShare}
              className="hover:text-[#121714] font-bold flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? "Link Copied! ✓" : "Share Proof"}</span>
            </button>

            <Link
              to="/marketplace"
              className="hover:text-[#6AB547] font-bold flex items-center gap-1"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Tamper Check Modal */}
      {tamperModalOpen && (
        <TamperCheckModal
          batchId={seed.id}
          batchNumber={seed.batchNumber}
          seedName={seed.name}
          certificateHash={seed.certificateHash}
          certificateCID={seed.certificateCID}
          isOpen={tamperModalOpen}
          onClose={() => setTamperModalOpen(false)}
        />
      )}
    </div>
  );
};
