import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { Navbar } from "./components/Navbar";
import { LoadingScreen } from "./components/LoadingScreen";
import { LandingPage } from "./pages/LandingPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { SeedDetailPage } from "./pages/SeedDetailPage";
import { FarmerDashboard } from "./pages/FarmerDashboard";
import { SellerDashboard } from "./pages/SellerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PublicVerifyPage } from "./pages/PublicVerifyPage";
import { LoginPage } from "./pages/LoginPage";
import { BlockchainPage } from "./pages/BlockchainPage";
import { connectMetaMask } from "./web3";
import { Sprout, Award } from "lucide-react";

function AppContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  const activeAddress = user?.address || "0x976EA74026E726554dB657fA54763abd0C3a0aa9";

  const handleConnectWallet = async () => {
    try {
      const res = await connectMetaMask();
      setIsWalletConnected(true);
      alert(`MetaMask Connected: ${res.address} (Chain ID: ${res.chainId})`);
    } catch (err: any) {
      alert(err.message || "Could not connect to MetaMask. Using active profile address.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07130b] text-slate-100 relative selection:bg-[#48A741] selection:text-white">

      {/* Seedling Sprouting Loading Animation on Mount */}
      {showInitialLoader && (
        <LoadingScreen
          minDurationMs={900}
          onComplete={() => setShowInitialLoader(false)}
        />
      )}

      {/* Navigation with Language Selector & Role Controls */}
      <Navbar
        onConnectWallet={handleConnectWallet}
        isWalletConnected={isWalletConnected}
      />

      {/* Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/marketplace" element={<MarketplacePage currentAddress={activeAddress} />} />
          <Route path="/seed/:id" element={<SeedDetailPage currentAddress={activeAddress} />} />
          <Route path="/farmer" element={<FarmerDashboard currentAddress={activeAddress} />} />
          <Route path="/seller" element={<SellerDashboard currentAddress={activeAddress} />} />
          <Route path="/admin" element={<AdminDashboard currentAddress={activeAddress} />} />
          <Route path="/blockchain" element={<BlockchainPage />} />
          <Route path="/verify/seed/:id" element={<PublicVerifyPage />} />
        </Routes>
      </main>

      {/* Beginner-Friendly Footer (Themed for #07130b and #48A741) */}
      <footer className="bg-[#050e07] border-t border-[#48A741]/20 py-10 mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#48A741] text-white flex items-center justify-center font-bold shadow-md shadow-[#48A741]/20">
                <Sprout className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-black text-sm text-white">
                  SeedSure AgriTech Platform
                </p>
                <p className="text-[11px] text-slate-400">
                  Decentralized Seed Quality Certification & Smart Escrow Marketplace
                </p>
              </div>
            </div>

            {/* Research Disclosure Notice */}
            <div className="flex items-center gap-2 bg-[#0a1f11] border border-[#48A741]/30 px-3.5 py-1.5 rounded-full text-[11px] text-[#48A741] font-semibold">
              <Award className="w-4 h-4 text-[#48A741] shrink-0" />
              <span>IEEE Target Research Demonstration • Synthetic Agricultural Datasets</span>
            </div>
          </div>

          <div className="border-t border-emerald-950/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p className="text-slate-400">
              Built for Farmer Protection & Seed Viability • Solidity + Ethers v6 + ML Multi-Factor Trust
            </p>
            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              <Link to="/marketplace" className="hover:text-[#48A741] font-medium transition-colors">{t("marketplace")}</Link>
              <Link to="/blockchain" className="hover:text-[#48A741] font-medium text-[#48A741] font-bold transition-colors">⛓️ {t("ethereumEscrow")}</Link>
              <Link to="/farmer" className="hover:text-[#48A741] font-medium transition-colors">{t("farmerPortal")}</Link>
              <Link to="/seller" className="hover:text-[#48A741] font-medium transition-colors">{t("breederHub")}</Link>
              <Link to="/admin" className="hover:text-[#48A741] font-medium transition-colors">{t("caConsole")}</Link>
              <Link to="/login" className="hover:text-[#48A741] font-bold text-white transition-colors">{t("login")}</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
