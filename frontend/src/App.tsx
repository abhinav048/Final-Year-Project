import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Navbar } from "./components/Navbar";
import { LoadingScreen } from "./components/LoadingScreen";
import { DemoDataRibbon } from "./components/DemoDataRibbon";
import { OnboardingModal } from "./components/OnboardingModal";
import { HelpDrawer } from "./components/HelpDrawer";
import { LandingPage } from "./pages/LandingPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { SeedDetailPage } from "./pages/SeedDetailPage";
import { FarmerDashboard } from "./pages/FarmerDashboard";
import { SellerDashboard } from "./pages/SellerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PublicVerifyPage } from "./pages/PublicVerifyPage";
import { LoginPage } from "./pages/LoginPage";
import { BlockchainPage } from "./pages/BlockchainPage";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { connectMetaMask } from "./web3";

import { ProtectedRoute } from "./components/ProtectedRoute";

function AppContent() {
  const { user } = useAuth();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-deep-backdrop text-[#121714] relative selection:bg-[#6AB547] selection:text-white">
      {/* 1. Permanent Demo Data / Sepolia Ribbon (§11.4 Rule 10) */}
      <DemoDataRibbon onReplayLoader={() => setShowInitialLoader(true)} />

      {/* 2. Seedling Sprouting Loading Animation on Mount */}
      {showInitialLoader && (
        <LoadingScreen
          minDurationMs={7000}
          onComplete={() => setShowInitialLoader(false)}
        />
      )}

      {/* 3. Navigation with Language Selector, Roles & First-Run Guide Trigger */}
      <Navbar
        onConnectWallet={handleConnectWallet}
        isWalletConnected={isWalletConnected}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      {/* 4. Main Content Area */}
      <main className="flex-1 mt-4">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/marketplace" element={<MarketplacePage currentAddress={activeAddress} />} />
          <Route path="/seed/:id" element={<SeedDetailPage currentAddress={activeAddress} />} />
          
          {/* Strictly Protected Role Portals */}
          <Route
            path="/farmer"
            element={
              <ProtectedRoute allowedRoles={["farmer"]}>
                <FarmerDashboard currentAddress={activeAddress} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={["seller"]}>
                <SellerDashboard currentAddress={activeAddress} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard currentAddress={activeAddress} />
              </ProtectedRoute>
            }
          />

          <Route path="/blockchain" element={<BlockchainPage />} />
          <Route path="/verify/seed/:id" element={<PublicVerifyPage />} />
          <Route path="/design-system" element={<DesignSystemPage />} />
        </Routes>
      </main>

      {/* 5. Guided First-Run 3-Step Onboarding Modal (§11.4 Rule 2) */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onConnectWallet={handleConnectWallet}
        isWalletConnected={isWalletConnected}
      />

      {/* 6. Persistent "Need Help?" Drawer (§11.4 Rule 2) */}
      <HelpDrawer onOpenOnboarding={() => setShowOnboarding(true)} />
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
