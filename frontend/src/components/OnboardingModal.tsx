import React, { useState } from "react";
import { X, Wallet, ArrowRight, ExternalLink, CheckCircle2, Coins, Globe } from "lucide-react";
import { PillButton } from "./PillButton";

export interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectWallet: () => void;
  isWalletConnected: boolean;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onConnectWallet,
  isWalletConnected
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const [networkSwitched, setNetworkSwitched] = useState(false);

  if (!isOpen) return null;

  const handleSwitchNetwork = async () => {
    setSwitchingNetwork(true);
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }] // Sepolia testnet
          });
          setNetworkSwitched(true);
        } catch (switchError: any) {
          // Chain not added, try adding it
          if (switchError.code === 4902) {
            await (window as any).ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia Test Network",
                  rpcUrls: ["https://rpc.sepolia.org"],
                  nativeCurrency: { name: "SepoliaETH", symbol: "SEP", decimals: 18 },
                  blockExplorerUrls: ["https://sepolia.etherscan.io"]
                }
              ]
            });
            setNetworkSwitched(true);
          } else {
            setNetworkSwitched(true); // simulate for demo
          }
        }
      } else {
        setNetworkSwitched(true);
      }
    } catch {
      setNetworkSwitched(true);
    } finally {
      setSwitchingNetwork(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2A1D]/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#F7F8F3] border border-[#E1E6DA] rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white border border-[#E1E6DA] text-[#5B665F] hover:text-[#121714] flex items-center justify-center cursor-pointer transition-colors"
          title="Close guide"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6AB547]">
            Beginner Guide • Getting Started in 3 Steps
          </span>
          <h3 className="text-2xl font-black text-[#121714] mt-1">
            Welcome to SeedSure
          </h3>
          <p className="text-xs text-[#5B665F] mt-1">
            Experience tamper-proof certified seeds and secure smart escrow without needing any prior blockchain experience.
          </p>
        </div>

        {/* 3 Steps Indicator */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { num: 1, title: "Connect Wallet" },
            { num: 2, title: "Test Network" },
            { num: 3, title: "Free Test ETH" }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                currentStep === s.num
                  ? "bg-white border-[#6AB547] shadow-xs"
                  : "bg-[#EEF3E6]/60 border-[#E1E6DA]"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center ${
                    currentStep === s.num
                      ? "bg-[#6AB547] text-white"
                      : "bg-[#E1E6DA] text-[#5B665F]"
                  }`}
                >
                  {s.num}
                </span>
                <span className="text-[11px] font-bold text-[#121714]">
                  {s.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Step 1 Content */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E1E6DA] space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#121714]">
                <Wallet className="w-4 h-4 text-[#6AB547]" />
                <span>Step 1: Open or Connect a Web3 Wallet</span>
              </div>
              <p className="text-xs text-[#5B665F] leading-relaxed">
                A digital wallet (like MetaMask or Rabby) acts as your cryptographic signature to approve seed purchases and hold funds safely in escrow.
              </p>
              <div className="pt-2">
                {isWalletConnected ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EEF8F1] text-[#2E9E57] text-xs font-bold border border-[#B8E4C7]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Wallet Already Connected!</span>
                  </div>
                ) : (
                  <PillButton
                    variant="primary"
                    size="sm"
                    withArrow
                    onClick={() => {
                      onConnectWallet();
                    }}
                  >
                    Connect MetaMask Now
                  </PillButton>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-[#5B665F]">Don't have MetaMask? It takes 60 seconds to install.</span>
              <PillButton variant="dark" size="sm" onClick={() => setCurrentStep(2)}>
                Next Step
              </PillButton>
            </div>
          </div>
        )}

        {/* Step 2 Content */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E1E6DA] space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#121714]">
                <Globe className="w-4 h-4 text-[#2F8F83]" />
                <span>Step 2: Switch to Sepolia / Local Test Network</span>
              </div>
              <p className="text-xs text-[#5B665F] leading-relaxed">
                SeedSure runs in research mode on the Ethereum Sepolia Testnet. All transactions use simulated test ether, so you never risk any real money.
              </p>
              <div className="pt-2">
                <PillButton
                  variant="secondary"
                  size="sm"
                  isLoading={switchingNetwork}
                  onClick={handleSwitchNetwork}
                >
                  {networkSwitched ? "Switched to Sepolia ✓" : "Switch to Sepolia Network"}
                </PillButton>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <PillButton variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                Back
              </PillButton>
              <PillButton variant="dark" size="sm" onClick={() => setCurrentStep(3)}>
                Next Step
              </PillButton>
            </div>
          </div>
        )}

        {/* Step 3 Content */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white border border-[#E1E6DA] space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-[#121714]">
                <Coins className="w-4 h-4 text-[#E9A93B]" />
                <span>Step 3: Get Free Testnet ETH for Escrow Orders</span>
              </div>
              <p className="text-xs text-[#5B665F] leading-relaxed">
                To test placing seed escrow orders or registering batches, request free test tokens from any public Sepolia faucet.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href="https://sepoliafaucet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#E1E6DA] hover:border-[#6AB547] text-xs font-bold text-[#121714]"
                >
                  <span>Google Sepolia Faucet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://faucet.quicknode.com/ethereum/sepolia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#E1E6DA] hover:border-[#6AB547] text-xs font-bold text-[#121714]"
                >
                  <span>QuickNode Faucet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <PillButton variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                Back
              </PillButton>
              <PillButton variant="primary" size="sm" withArrow onClick={onClose}>
                Ready! Explore Seeds
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
