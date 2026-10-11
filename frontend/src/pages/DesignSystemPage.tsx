import React, { useState } from "react";
import { PillButton } from "../components/PillButton";
import { TagPill } from "../components/TagPill";
import { LeafDecor } from "../components/LeafDecor";
import { TrustScoreCard } from "../components/TrustScoreCard";
import { StatusStepper, OrderStep } from "../components/StatusStepper";
import { VerifiedBadge } from "../components/VerifiedBadge";
import { TxModal, TxStatus } from "../components/TxModal";
import { EmptyState } from "../components/EmptyState";
import { Skeleton, ErrorState } from "../components/ErrorState";
import { VerificationStepsCard } from "../components/VerificationStepsCard";
import { ExecutionStepsModal } from "../components/ExecutionStepsModal";
import { Sparkles, Sprout, ArrowRight, ShieldCheck, Coins, Check } from "lucide-react";

export const DesignSystemPage: React.FC = () => {
  const [interactiveScore, setInteractiveScore] = useState(88);
  const [activeStep, setActiveStep] = useState<OrderStep>("escrowed");
  const [modalStatus, setModalStatus] = useState<TxStatus | null>(null);
  const [executionModalOpen, setExecutionModalOpen] = useState(false);

  return (
    <div className="space-y-12 max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="border-b border-[#E1E6DA] pb-6">
        <TagPill icon={<Sparkles className="w-3.5 h-3.5 text-[#6AB547]" />}>
          SeedSure UI Specification §11
        </TagPill>
        <h1 className="text-3xl sm:text-4xl font-black text-[#121714] mt-3">
          Design System & Signature Components
        </h1>
        <p className="text-sm text-[#5B665F] mt-1 max-w-2xl leading-relaxed">
          Living component library and design tokens for the light-but-not-white AgriTech Web3 design language.
        </p>
      </div>

      {/* 1. COLOR TOKENS */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#121714]">
          1. Design Tokens & Color Palette (§11.2)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-[20px] bg-[#0F2A1D] text-white text-xs space-y-1 shadow-sm">
            <div className="font-extrabold">Deep Backdrop</div>
            <div className="font-mono text-[11px] text-[#85928B]">#0F2A1D</div>
            <div className="text-[10px] text-[#A2B1A8]">Page gradient start</div>
          </div>
          <div className="p-4 rounded-[20px] bg-[#163A24] text-white text-xs space-y-1 shadow-sm">
            <div className="font-extrabold">Deep Green</div>
            <div className="font-mono text-[11px] text-[#85928B]">#163A24</div>
            <div className="text-[10px] text-[#A2B1A8]">Footer & contrast</div>
          </div>
          <div className="p-4 rounded-[20px] bg-[#F7F8F3] border border-[#E1E6DA] text-[#121714] text-xs space-y-1 shadow-sm">
            <div className="font-extrabold">Sheet Surface</div>
            <div className="font-mono text-[11px] text-[#5B665F]">#F7F8F3</div>
            <div className="text-[10px] text-[#5B665F]">Warm off-white</div>
          </div>
          <div className="p-4 rounded-[20px] bg-[#EEF3E6] border border-[#D2ECC3] text-[#121714] text-xs space-y-1 shadow-sm">
            <div className="font-extrabold">Sage Mist</div>
            <div className="font-mono text-[11px] text-[#5B665F]">#EEF3E6</div>
            <div className="text-[10px] text-[#5B665F]">Section alternate</div>
          </div>
          <div className="p-4 rounded-[20px] bg-[#F1EFE6] border border-[#E1E6DA] text-[#121714] text-xs space-y-1 shadow-sm">
            <div className="font-extrabold">Warm Sand</div>
            <div className="font-mono text-[11px] text-[#5B665F]">#F1EFE6</div>
            <div className="text-[10px] text-[#5B665F]">Section alternate</div>
          </div>
          <div className="p-4 rounded-[20px] bg-[#6AB547] text-white text-xs space-y-1 shadow-sm">
            <div className="font-extrabold">Primary Green</div>
            <div className="font-mono text-[11px] text-white/80">#6AB547</div>
            <div className="text-[10px] text-white/90">Main CTAs & branding</div>
          </div>
        </div>

        {/* Trust Multi-Tier Colors */}
        <div className="pt-2">
          <p className="text-xs font-bold text-[#5B665F] uppercase mb-2 tracking-wider">
            Trust Level System (Paired with icon + label)
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-2xl bg-[#EEF8F1] border border-[#B8E4C7] text-[#2E9E57] text-xs font-bold">
              Excellent (#2E9E57) • 80-100
            </div>
            <div className="p-3 rounded-2xl bg-[#F1F8ED] border border-[#D2ECC3] text-[#6AB547] text-xs font-bold">
              Trusted (#6AB547) • 70-79
            </div>
            <div className="p-3 rounded-2xl bg-[#FEF9EE] border border-[#FADFA8] text-[#E9A93B] text-xs font-bold">
              Moderate (#E9A93B) • 55-69
            </div>
            <div className="p-3 rounded-2xl bg-[#FDF4EE] border border-[#F6C8A8] text-[#E27B3C] text-xs font-bold">
              Low (#E27B3C) • 40-54
            </div>
            <div className="p-3 rounded-2xl bg-[#FDF1F0] border border-[#F7B8B2] text-[#D8503F] text-xs font-bold">
              High Risk (#D8503F) • &lt;40
            </div>
          </div>
        </div>
      </section>

      {/* 2. PILLBUTTON COMPONENT */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#121714]">
          2. PillButton Component (§11.3)
        </h2>
        <div className="p-6 rounded-[24px] bg-white border border-[#E1E6DA] space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <PillButton variant="primary" withArrow>
              Primary Leaf Green
            </PillButton>
            <PillButton variant="secondary" withArrow>
              Secondary Outline
            </PillButton>
            <PillButton variant="dark" withArrow>
              Dark Pill Button
            </PillButton>
            <PillButton variant="ghost">
              Ghost Button
            </PillButton>
            <PillButton variant="primary" isLoading loadingText="Confirm in your wallet…">
              Confirm in your wallet…
            </PillButton>
            <PillButton variant="dark" isLoading loadingText="Reading blockchain record…">
              Processing…
            </PillButton>
            <PillButton variant="primary" disabled>
              Disabled
            </PillButton>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F1EFE6]">
            <span className="text-xs text-[#5B665F] font-bold">Sizes (min 48px tap targets on md/lg):</span>
            <PillButton size="sm">Small (38px)</PillButton>
            <PillButton size="md" withArrow>Medium (48px)</PillButton>
            <PillButton size="lg" withArrow>Large (54px)</PillButton>
          </div>
        </div>
      </section>

      {/* 2b. VERIFICATION STEPS & SPROUT PULSE BUTTON (§11.5) */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#121714]">
          2b. Verification Steps & Execution Sprout Wave (§11.5)
        </h2>
        <p className="text-xs text-[#5B665F]">
          Exact specification: Verification steps (blockchain, certificate hash, seller score) and skeleton with pulsing sprout button.
        </p>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <VerificationStepsCard
            currentStep={2}
            progress={68}
            showSkeletonAndButton={true}
            buttonText="Confirm in your wallet…"
          />
          <div className="p-6 rounded-[28px] bg-white border border-[#E1E6DA] space-y-4 max-w-sm">
            <h4 className="font-extrabold text-sm text-[#121714]">Interactive Modal Execution</h4>
            <p className="text-xs text-[#5B665F] leading-relaxed">
              Click the button below to launch the modal simulation and watch the steps auto-progress from reading the blockchain record to confirming on-chain.
            </p>
            <PillButton
              variant="primary"
              size="md"
              withArrow
              onClick={() => setExecutionModalOpen(true)}
            >
              Test Live Execution
            </PillButton>
          </div>
        </div>
      </section>

      {/* 3. TAGPILL & LEAFDECOR */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#121714]">
          3. TagPill & LeafDecor Line-Art (§11.3)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-[24px] bg-white border border-[#E1E6DA] space-y-3">
            <h3 className="text-sm font-bold text-[#121714]">TagPill Varieties</h3>
            <div className="flex flex-wrap gap-2">
              <TagPill>Verified seeds, protected payments</TagPill>
              <TagPill icon={<Coins className="w-3.5 h-3.5 text-[#E9A93B]" />}>
                Zero Upfront Risk
              </TagPill>
              <TagPill icon={<ShieldCheck className="w-3.5 h-3.5 text-[#2E9E57]" />}>
                Sepolia Testnet
              </TagPill>
            </div>
          </div>

          <div className="p-6 rounded-[24px] bg-white border border-[#E1E6DA] flex items-center justify-around">
            <div className="w-24 h-28">
              <LeafDecor variant="branch" />
            </div>
            <div className="w-20 h-20">
              <LeafDecor variant="sprout" />
            </div>
            <div className="w-24 h-24">
              <LeafDecor variant="fern" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRUSTSCORECARD COMPONENT */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#121714]">
            4. TrustScoreCard Component (§11.3)
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#5B665F] font-bold">Simulate Score:</span>
            <input
              type="range"
              min="20"
              max="99"
              value={interactiveScore}
              onChange={(e) => setInteractiveScore(parseInt(e.target.value))}
              className="accent-[#6AB547] cursor-pointer"
            />
            <span className="font-extrabold text-[#121714] w-8">{interactiveScore}</span>
          </div>
        </div>
        <div className="max-w-xl">
          <TrustScoreCard
            score={interactiveScore}
            sellerName="National Agri-Seed Research Consortium"
            isVerified={interactiveScore >= 70}
            totalOrders={420}
          />
        </div>
      </section>

      {/* 5. STATUSSTEPPER COMPONENT */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#121714]">
          5. StatusStepper Order Timeline (§11.3)
        </h2>
        <StatusStepper
          currentStep={activeStep}
          onStepSelect={(step) => setActiveStep(step)}
        />
      </section>

      {/* 6. VERIFIEDBADGE */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#121714]">
          6. VerifiedBadge Component (§11.3)
        </h2>
        <div className="p-6 rounded-[24px] bg-white border border-[#E1E6DA] flex flex-wrap gap-4 items-center">
          <VerifiedBadge isValid={true} showDetails={true} />
          <VerifiedBadge isValid={false} tamperDetected={true} showDetails={true} />
          <VerifiedBadge isValid={true} size="sm" />
          <VerifiedBadge isValid={false} tamperDetected={true} size="sm" />
        </div>
      </section>

      {/* 7. TXMODAL SIMULATION */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#121714]">
          7. Plain-Language Blockchain Tx Lifecycle (§11.3 & §11.4)
        </h2>
        <div className="p-6 rounded-[24px] bg-white border border-[#E1E6DA] flex flex-wrap gap-3">
          <PillButton variant="secondary" onClick={() => setModalStatus("preparing")}>
            Simulate "Preparing"
          </PillButton>
          <PillButton variant="secondary" onClick={() => setModalStatus("pending")}>
            Simulate "Pending"
          </PillButton>
          <PillButton variant="primary" onClick={() => setModalStatus("confirmed")}>
            Simulate "Confirmed"
          </PillButton>
          <PillButton variant="dark" onClick={() => setModalStatus("failed")}>
            Simulate "Failed with Revert"
          </PillButton>
        </div>

        {modalStatus && (
          <TxModal
            isOpen={true}
            status={modalStatus}
            title="Locking Payment in Smart Escrow"
            whatWillHappen="Your 0.08 ETH payment is held in the non-custodial Marketplace smart contract. The seller cannot claim the money until you confirm healthy seed viability."
            txHash={
              modalStatus === "confirmed"
                ? "0x789abcde1234567890abcdef1234567890abcdef1234567890abcdef12345678"
                : undefined
            }
            errorMessage={
              modalStatus === "failed"
                ? "The transaction was cancelled in your wallet before broadcasting."
                : undefined
            }
            rawError="Error: User rejected the request (code 4001) at MetaMaskProvider.request"
            onClose={() => setModalStatus(null)}
            onRetry={() => setModalStatus("preparing")}
          />
        )}
      </section>

      {/* 8. EMPTY & ERROR STATES */}
      <section className="space-y-4">
        <h2 className="text-xl font-extrabold text-[#121714]">
          8. Empty, Skeleton & Error States (§11.3)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmptyState
            title="No Seed Batches Listed"
            description="There are currently no seed batches matching your search query. Try clearing the filter or checking back tomorrow."
            actionLabel="Reset Search Filter"
            onAction={() => alert("Search filter reset")}
          />
          <ErrorState
            title="Unable to Query Smart Contract"
            description="The local blockchain RPC was temporarily unavailable. Check if anvil is running."
            onRetry={() => alert("Retrying RPC query")}
          />
        </div>
      </section>

      {/* Execution Modal Interactive Simulation */}
      <ExecutionStepsModal
        isOpen={executionModalOpen}
        onClose={() => setExecutionModalOpen(false)}
        title="Execution Protocol & Smart Contract Escrow"
      />
    </div>
  );
};
