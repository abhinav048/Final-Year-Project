import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { PillButton } from "../components/PillButton";
import { TagPill } from "../components/TagPill";
import {
  Sprout,
  Building2,
  Shield,
  ArrowRight,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  KeyRound,
  User,
  Sparkles,
  HelpCircle
} from "lucide-react";

export const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<UserRole>("farmer");
  const [farmerPhone, setFarmerPhone] = useState("+91 98765-43210");
  const [farmerName, setFarmerName] = useState("Ramesh Patel");
  const [sellerEmail, setSellerEmail] = useState("breeder@agrigrow.com");
  const [sellerCompany, setSellerCompany] = useState("AgriGrow Seed Breeders Ltd.");
  const [adminId, setAdminId] = useState("CA-ICAR-OFFICER-771");
  const [adminName, setAdminName] = useState("Dr. K. Sharma");
  const [password, setPassword] = useState("••••••••");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === "farmer") {
      login("farmer", farmerName, farmerPhone);
      navigate("/marketplace");
    } else if (activeTab === "seller") {
      login("seller", sellerCompany, sellerEmail);
      navigate("/seller");
    } else {
      login("admin", adminName, adminId);
      navigate("/admin");
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    login(role);
    if (role === "farmer") navigate("/marketplace");
    else if (role === "seller") navigate("/seller");
    else navigate("/admin");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="sheet-surface wave-pattern border border-[#E1E6DA] p-6 sm:p-10 shadow-sheet space-y-8 bg-white">

        {/* Header Greeting */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <TagPill icon={<Sparkles className="w-3.5 h-3.5 text-[#6AB547]" />}>
              Select Your Role to Access SeedSure
            </TagPill>
          </div>
          <h1 className="font-extrabold text-3xl sm:text-4xl text-[#121714] tracking-tight">
            Welcome to Seed<span className="text-[#6AB547]">Sure</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5B665F] max-w-md mx-auto">
            Choose your login section below. Each portal is customized for your specific agricultural role.
          </p>
        </div>

        {/* 3 Role Selection Cards / Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Farmer Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("farmer")}
            className={`p-4 rounded-[20px] border text-left transition-all cursor-pointer ${
              activeTab === "farmer"
                ? "bg-[#EEF3E6] border-[#6AB547] shadow-xs"
                : "bg-white border-[#E1E6DA] hover:bg-[#F7F8F3]"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E1E6DA] text-[#6AB547] flex items-center justify-center mb-2.5">
              <Sprout className="w-6 h-6 text-[#6AB547]" />
            </div>
            <h3 className="font-extrabold text-sm text-[#121714]">1. Farmer Portal</h3>
            <p className="text-[11px] text-[#5B665F] mt-0.5 leading-snug">
              Buy genuine seeds with escrow protection.
            </p>
          </button>

          {/* 2. Seller Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("seller")}
            className={`p-4 rounded-[20px] border text-left transition-all cursor-pointer ${
              activeTab === "seller"
                ? "bg-[#EEF3E6] border-[#6AB547] shadow-xs"
                : "bg-white border-[#E1E6DA] hover:bg-[#F7F8F3]"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E1E6DA] text-[#6AB547] flex items-center justify-center mb-2.5">
              <Building2 className="w-6 h-6 text-[#6AB547]" />
            </div>
            <h3 className="font-extrabold text-sm text-[#121714]">2. Breeder Hub</h3>
            <p className="text-[11px] text-[#5B665F] mt-0.5 leading-snug">
              List seed lots, ship orders & manage trust score.
            </p>
          </button>

          {/* 3. Admin / CA Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            className={`p-4 rounded-[20px] border text-left transition-all cursor-pointer ${
              activeTab === "admin"
                ? "bg-[#EEF3E6] border-[#6AB547] shadow-xs"
                : "bg-white border-[#E1E6DA] hover:bg-[#F7F8F3]"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E1E6DA] text-[#6AB547] flex items-center justify-center mb-2.5">
              <Shield className="w-6 h-6 text-[#6AB547]" />
            </div>
            <h3 className="font-extrabold text-sm text-[#121714]">3. CA Console</h3>
            <p className="text-[11px] text-[#5B665F] mt-0.5 leading-snug">
              Audit lab test reports & arbitrate disputes.
            </p>
          </button>
        </div>

        {/* Login Form Container */}
        <div className="bg-[#F7F8F3] rounded-[24px] border border-[#E1E6DA] p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[#E1E6DA]">
            <h2 className="font-extrabold text-lg text-[#121714]">
              {activeTab === "farmer" && "Farmer Login (Seed Buyer)"}
              {activeTab === "seller" && "Breeder Login (Seed Producer)"}
              {activeTab === "admin" && "Certification Authority Officer Login"}
            </h2>
            <p className="text-xs text-[#5B665F] mt-0.5">
              Enter your demo credentials or click one-click instant sign in below.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {activeTab === "farmer" && (
              <>
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">Farmer Full Name</label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">Mobile Number / Kisan Credit ID</label>
                  <input
                    type="text"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
                  />
                </div>
              </>
            )}

            {activeTab === "seller" && (
              <>
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">Breeder Enterprise / Institute Name</label>
                  <input
                    type="text"
                    required
                    value={sellerCompany}
                    onChange={(e) => setSellerCompany(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">Official Breeder Email</label>
                  <input
                    type="email"
                    required
                    value={sellerEmail}
                    onChange={(e) => setSellerEmail(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
                  />
                </div>
              </>
            )}

            {activeTab === "admin" && (
              <>
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">CA Officer Name</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#121714] block mb-1">Accredited Authority Badge ID</label>
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono"
                  />
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <PillButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleQuickDemoLogin(activeTab)}
              >
                Instant 1-Click Demo Login
              </PillButton>

              <PillButton
                type="submit"
                variant="primary"
                size="md"
                withArrow
              >
                Enter Portal
              </PillButton>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
