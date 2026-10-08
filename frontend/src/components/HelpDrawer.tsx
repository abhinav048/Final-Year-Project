import React, { useState } from "react";
import { HelpCircle, X, ChevronDown, ShieldCheck, Lock, QrCode, Phone } from "lucide-react";
import { PillButton } from "./PillButton";

export interface HelpDrawerProps {
  onOpenOnboarding?: () => void;
}

export const HelpDrawer: React.FC<HelpDrawerProps> = ({ onOpenOnboarding }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the smart escrow protect my payment?",
      a: "When you place an order, your money does not go to the seller. Instead, an automated smart contract holds the funds. The seller only receives payment after you scan the bag and confirm healthy germination."
    },
    {
      q: "What if the seeds are fake or defective?",
      a: "You simply click 'Raise Dispute' in your Farmer Portal. The funds remain locked and the Platform Arbiter evaluates the lab test to return your full refund."
    },
    {
      q: "How does scanning the QR code prove authenticity?",
      a: "Every seed bag has a cryptographic tag. Your camera hashes the lab document with SHA-256 and matches it against the blockchain record. If anything was forged, it immediately alerts you."
    },
    {
      q: "Do I need real money or cryptocurrency?",
      a: "No! SeedSure runs in prototype testnet mode with free test tokens. Prices are also shown with an estimated Indian Rupee (INR) reference."
    }
  ];

  return (
    <>
      {/* Floating Trigger Button on bottom-right */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#121714] text-white hover:bg-[#1E2922] px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 text-xs font-bold border border-[#2A372F] cursor-pointer hover-subtle-lift"
        title="Open Help & Plain Language Guide"
      >
        <HelpCircle className="w-4 h-4 text-[#6AB547]" />
        <span>Need Help?</span>
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-[#0F2A1D]/60 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-md w-full bg-[#F7F8F3] shadow-2xl flex flex-col border-l border-[#E1E6DA] z-50 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-6 border-b border-[#E1E6DA] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EEF3E6] text-[#6AB547] flex items-center justify-center font-bold">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#121714]">
                    Farmer Assistance Hub
                  </h4>
                  <p className="text-[11px] text-[#5B665F]">
                    Plain-language answers for transparent seed buying
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F7F8F3] border border-[#E1E6DA] text-[#5B665F] hover:text-[#121714] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Onboarding Trigger Banner */}
              <div className="p-4 rounded-2xl bg-[#EEF3E6] border border-[#D2ECC3] space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E9E57]">
                  New to SeedSure?
                </span>
                <p className="text-xs text-[#121714] font-medium leading-relaxed">
                  Take the interactive 3-step beginner tour to learn how smart escrow and QR bag verification work.
                </p>
                <PillButton
                  variant="primary"
                  size="sm"
                  withArrow
                  onClick={() => {
                    setIsOpen(false);
                    onOpenOnboarding?.();
                  }}
                >
                  Start Beginner Tour
                </PillButton>
              </div>

              {/* FAQs Accordion */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#5B665F]">
                  Frequently Asked Questions
                </h5>

                {faqs.map((faq, index) => {
                  const isOpenItem = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl border border-[#E1E6DA] overflow-hidden transition-all shadow-xs"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpenItem ? null : index)}
                        className="w-full text-left p-4 flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <span className="text-xs font-bold text-[#121714] leading-snug">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#5B665F] shrink-0 transition-transform ${
                            isOpenItem ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {isOpenItem && (
                        <div className="px-4 pb-4 pt-1 text-xs text-[#5B665F] leading-relaxed border-t border-[#F1EFE6]">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Plain Language Jargon Buster */}
              <div className="p-4 rounded-2xl bg-white border border-[#E1E6DA] space-y-2.5">
                <h5 className="text-xs font-bold text-[#121714] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#6AB547]" />
                  <span>Simple Jargon Dictionary</span>
                </h5>
                <ul className="text-xs space-y-2 text-[#5B665F]">
                  <li>
                    <strong className="text-[#121714]">Smart Escrow:</strong>{" "}
                    A digital safety deposit box that holds payment until both farmer and breeder are satisfied.
                  </li>
                  <li>
                    <strong className="text-[#121714]">Digital Fingerprint:</strong>{" "}
                    A unique code (SHA-256) calculated from the laboratory certificate so no one can fake the germination rate.
                  </li>
                  <li>
                    <strong className="text-[#121714]">Reliability Score:</strong>{" "}
                    An AI score from 0 to 100 assessing seller delivery timeliness and seed viability history.
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E1E6DA] bg-white text-center">
              <p className="text-[11px] text-[#5B665F]">
                SeedSure Open AgriTech Demonstration • Sepolia Test Network
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
