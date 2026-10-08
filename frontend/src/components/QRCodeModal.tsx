import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, QrCode, Download, ExternalLink, CheckCircle } from "lucide-react";

interface QRCodeModalProps {
  batchId: number;
  batchNumber: string;
  seedName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  batchId,
  batchNumber,
  seedName,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const verifyUrl = `${window.location.origin}/verify/seed/${batchId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a1f11] rounded-2xl max-w-sm w-full border border-[#48A741]/30 shadow-2xl overflow-hidden text-center text-slate-100">

        {/* Header */}
        <div className="px-5 py-4 bg-[#07130b] border-b border-[#48A741]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#48A741]" />
            <h3 className="font-display font-black text-sm text-white">
              Seed Bag QR Code
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Presentation */}
        <div className="p-6 space-y-4 flex flex-col items-center">
          <div className="p-4 bg-white rounded-2xl border-2 border-[#48A741] shadow-lg shadow-[#48A741]/20">
            <QRCodeSVG
              value={verifyUrl}
              size={190}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "https://cdn-icons-png.flaticon.com/512/628/628283.png",
                x: undefined,
                y: undefined,
                height: 28,
                width: 28,
                excavate: true,
              }}
            />
          </div>

          <div className="space-y-1">
            <h4 className="font-display font-black text-base text-white">{seedName}</h4>
            <p className="text-xs font-mono text-[#48A741] bg-[#48A741]/10 px-2.5 py-0.5 rounded-full inline-block border border-[#48A741]/30 font-bold">
              Lot #{batchNumber}
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs pt-1">
              Printed on physical seed packaging. When scanned with any mobile camera, instantly brings the farmer to the tamper-proof on-chain certification page.
            </p>
          </div>

          <a
            href={`/verify/seed/${batchId}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#48A741] hover:text-emerald-400"
          >
            <span>Open Target Verification Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#07130b] border-t border-[#48A741]/20 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#48A741] hover:bg-[#3da338] text-white shadow-md shadow-[#48A741]/25 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
