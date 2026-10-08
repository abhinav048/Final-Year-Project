import React, { useState } from "react";
import { verifyDocumentTamper } from "../api";
import { TamperCheckResult } from "../types";
import { ShieldCheck, ShieldAlert, X, RefreshCw, FileText, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface TamperCheckModalProps {
  batchId: number;
  batchNumber: string;
  seedName: string;
  certificateHash: string;
  certificateCID: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TamperCheckModal: React.FC<TamperCheckModalProps> = ({
  batchId,
  batchNumber,
  seedName,
  certificateHash,
  certificateCID,
  isOpen,
  onClose
}) => {
  const [simulateTamper, setSimulateTamper] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TamperCheckResult | null>(null);

  if (!isOpen) return null;

  const handleRunCheck = async () => {
    setLoading(true);
    try {
      const res = await verifyDocumentTamper(batchId, undefined, simulateTamper);
      setResult(res);
    } catch (err: any) {
      alert("Verification failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a1f11] rounded-2xl max-w-xl w-full border border-[#48A741]/30 shadow-2xl overflow-hidden text-slate-100">

        {/* Header */}
        <div className="px-6 py-4 bg-[#07130b] border-b border-[#48A741]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#48A741]/20 text-[#48A741] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-[#48A741]" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-white">
                Cryptographic Tamper Check
              </h3>
              <p className="text-xs text-slate-400">
                Verifying {seedName} (Lot #{batchNumber})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">

          {/* Metadata Card */}
          <div className="p-3.5 rounded-xl bg-[#07130b] border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Smart Contract:</span>
              <span className="font-mono text-[11px] text-[#48A741] bg-[#48A741]/10 px-2 py-0.5 rounded border border-[#48A741]/30 font-semibold">
                SeedRegistry.sol (0xe7f1...0512)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">IPFS Document CID:</span>
              <span className="font-mono text-slate-200 bg-[#0a1f11] px-2 py-0.5 rounded border border-slate-800">
                {certificateCID}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-400">On-Chain Registered SHA-256:</span>
              <span className="font-mono text-[11px] text-slate-200 bg-[#0a1f11] p-1.5 rounded border border-slate-800 break-all font-semibold">
                {certificateHash}
              </span>
            </div>
          </div>

          {/* Tamper Simulation Toggle */}
          <div className="p-3.5 rounded-xl border border-dashed border-amber-500/40 bg-amber-950/30 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                Simulate Adversarial Tampering
              </span>
              <p className="text-[11px] text-amber-300/80">
                Inject 1-byte alteration into the lab certificate to demonstrate detection.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={simulateTamper}
                onChange={(e) => {
                  setSimulateTamper(e.target.checked);
                  setResult(null);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Test Action */}
          <button
            onClick={handleRunCheck}
            disabled={loading}
            className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${simulateTamper
                ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/30"
                : "bg-[#48A741] hover:bg-[#3da338] text-white shadow-[#48A741]/30"
              }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Computing Cryptographic Hash...
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                {simulateTamper ? "Verify Altered Document" : "Run Authenticity Verification"}
              </>
            )}
          </button>

          {/* Verification Result */}
          {result && (
            <div
              className={`p-4 rounded-xl border animate-in zoom-in-95 duration-200 ${result.status === "PASS"
                  ? "bg-[#07130b] border-[#48A741]/50 text-emerald-300"
                  : "bg-[#07130b] border-rose-600/50 text-rose-300"
                }`}
            >
              <div className="flex items-start gap-3">
                {result.status === "PASS" ? (
                  <CheckCircle2 className="w-6 h-6 text-[#48A741] shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-sm uppercase tracking-wider text-white">
                      Tamper Check: {result.status}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${result.status === "PASS"
                          ? "bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/40"
                          : "bg-rose-950 text-rose-300 border border-rose-800"
                        }`}
                    >
                      {result.status === "PASS" ? "AUTHENTIC" : "FORGERY DETECTED"}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">{result.message}</p>

                  <div className="pt-2 text-[11px] font-mono space-y-1">
                    <p className="truncate text-slate-400">
                      Computed: <span className="text-white">{result.computedHash}</span>
                    </p>
                    <p className="truncate text-slate-400">
                      Expected: <span className="text-white">{result.expectedHash}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#07130b] border-t border-[#48A741]/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
