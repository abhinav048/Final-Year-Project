import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
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
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-slate-100 animate-in fade-in duration-300">
      <div className="max-w-2xl w-full space-y-8">

        {/* Header Greeting */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#48A741]/15 text-[#48A741] text-xs font-bold border border-[#48A741]/30">
            <Sparkles className="w-4 h-4 text-[#48A741]" />
            <span>Select Your Role to Access SeedSure</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Welcome to Seed<span className="text-[#48A741]">Sure</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Choose your login section below. Each portal is customized for your specific agricultural role.
          </p>
        </div>

        {/* 3 Role Selection Cards / Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* 1. Farmer Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("farmer")}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${activeTab === "farmer"
                ? "bg-[#0f2c19] border-[#48A741] shadow-lg shadow-[#48A741]/20 ring-1 ring-[#48A741]/30"
                : "bg-[#0a1f11] border-[#48A741]/20 hover:border-[#48A741]/50 hover:bg-[#0d2415]"
              }`}
          >
            {activeTab === "farmer" && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#48A741]"></span>
            )}
            <div className="w-10 h-10 rounded-xl bg-[#48A741]/20 text-[#48A741] flex items-center justify-center mb-2.5">
              <Sprout className="w-6 h-6 text-[#48A741]" />
            </div>
            <h3 className="font-display font-bold text-sm text-white">1. {t("farmerPortal")}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Buy genuine seeds with Escrow protection.
            </p>
          </button>

          {/* 2. Seller Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("seller")}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${activeTab === "seller"
                ? "bg-[#0f2c19] border-[#48A741] shadow-lg shadow-[#48A741]/20 ring-1 ring-[#48A741]/30"
                : "bg-[#0a1f11] border-[#48A741]/20 hover:border-[#48A741]/50 hover:bg-[#0d2415]"
              }`}
          >
            {activeTab === "seller" && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#48A741]"></span>
            )}
            <div className="w-10 h-10 rounded-xl bg-[#48A741]/20 text-[#48A741] flex items-center justify-center mb-2.5">
              <Building2 className="w-6 h-6 text-[#48A741]" />
            </div>
            <h3 className="font-display font-bold text-sm text-white">2. {t("breederHub")}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              List seed lots, ship orders & manage trust score.
            </p>
          </button>

          {/* 3. Admin / CA Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("admin")}
            className={`p-4 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${activeTab === "admin"
                ? "bg-[#0f2c19] border-[#48A741] shadow-lg shadow-[#48A741]/20 ring-1 ring-[#48A741]/30"
                : "bg-[#0a1f11] border-[#48A741]/20 hover:border-[#48A741]/50 hover:bg-[#0d2415]"
              }`}
          >
            {activeTab === "admin" && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#48A741]"></span>
            )}
            <div className="w-10 h-10 rounded-xl bg-[#48A741]/20 text-[#48A741] flex items-center justify-center mb-2.5">
              <Shield className="w-6 h-6 text-[#48A741]" />
            </div>
            <h3 className="font-display font-bold text-sm text-white">3. {t("caConsole")}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
              Audit lab test reports & arbitrate disputes.
            </p>
          </button>

        </div>

        {/* Login Form Container */}
        <div className="bg-[#0a1f11] rounded-3xl border border-[#48A741]/25 shadow-2xl p-6 sm:p-8 space-y-6">

          {/* Active Portal Title & Explainer */}
          <div className="pb-4 border-b border-[#48A741]/15 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {activeTab === "farmer" ? "🌾" : activeTab === "seller" ? "🏢" : "🛡️"}
                </span>
                <h2 className="font-display font-black text-xl text-white">
                  {activeTab === "farmer"
                    ? "Farmer Login (Kisan Pravesh)"
                    : activeTab === "seller"
                      ? "Seed Breeder / Seller Login"
                      : "Certification Authority (CA) Login"}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab === "farmer"
                  ? "Access your escrow orders, track seed deliveries, and confirm payment releases."
                  : activeTab === "seller"
                    ? "Register seed batches, upload certified lab reports, and manage fulfillment."
                    : "Authorized government agency portal for official seed batch audits & certifications."}
              </p>
            </div>
          </div>

          {/* Beginner-Friendly Tip Box */}
          <div className="p-4 rounded-2xl border border-[#48A741]/30 bg-[#07130b] text-xs flex items-start gap-3">
            <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#48A741]" />
            <div>
              <strong className="block font-bold text-white">
                {activeTab === "farmer"
                  ? "Why is it 100% safe for Farmers?"
                  : activeTab === "seller"
                    ? "How does SeedSure help Breeders?"
                    : "Government Regulatory Standard"}
              </strong>
              <p className="mt-0.5 leading-relaxed text-slate-300 text-[11px]">
                {activeTab === "farmer"
                  ? "When you buy seeds on SeedSure, your payment goes into a smart lockbox (Escrow). The seller cannot take your money until you receive the seeds and verify their quality!"
                  : activeTab === "seller"
                    ? "Genuine breeders with high lab purity and on-time delivery earn a high AI Trust Score (up to 100), attracting more farmers and eliminating counterfeit competition."
                    : "All certifications require cryptographic verification of the physical lab test document against its immutable SHA-256 hash."}
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">

            {activeTab === "farmer" && (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#48A741]" />
                    <span>Farmer Name:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full p-3 rounded-xl border border-slate-700 bg-[#07130b] text-white placeholder-slate-500 focus:outline-none focus:border-[#48A741] text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#48A741]" />
                    <span>Mobile Number or Kisan ID:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="+91 98765-43210"
                    className="w-full p-3 rounded-xl border border-slate-700 bg-[#07130b] text-white placeholder-slate-500 focus:outline-none focus:border-[#48A741] text-sm font-mono"
                  />
                </div>
              </>
            )}

            {activeTab === "seller" && (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#48A741]" />
                    <span>Seed Breeder / Company Name:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerCompany}
                    onChange={(e) => setSellerCompany(e.target.value)}
                    placeholder="e.g. AgriGrow Seed Breeders Ltd."
                    className="w-full p-3 rounded-xl border border-slate-700 bg-[#07130b] text-white placeholder-slate-500 focus:outline-none focus:border-[#48A741] text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#48A741]" />
                    <span>Business Email / License Number:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerEmail}
                    onChange={(e) => setSellerEmail(e.target.value)}
                    placeholder="breeder@agrigrow.com"
                    className="w-full p-3 rounded-xl border border-slate-700 bg-[#07130b] text-white placeholder-slate-500 focus:outline-none focus:border-[#48A741] text-sm font-mono"
                  />
                </div>
              </>
            )}

            {activeTab === "admin" && (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#48A741]" />
                    <span>Officer Name:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="e.g. Dr. K. Sharma"
                    className="w-full p-3 rounded-xl border border-slate-700 bg-[#07130b] text-white placeholder-slate-500 focus:outline-none focus:border-[#48A741] text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-[#48A741]" />
                    <span>Government Certification Authority Badge ID:</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="CA-ICAR-OFFICER-771"
                    className="w-full p-3 rounded-xl border border-slate-700 bg-[#07130b] text-white placeholder-slate-500 focus:outline-none focus:border-[#48A741] text-sm font-mono"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Security PIN / Password:</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-700 bg-[#07130b] text-white focus:outline-none focus:border-[#48A741] text-sm font-mono"
              />
            </div>

            {/* Standard Login Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#48A741] hover:bg-[#3da338] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#48A741]/25 transition-all"
            >
              <span>Login to {activeTab === "farmer" ? "Farmer Portal" : activeTab === "seller" ? "Breeder Hub" : "CA Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Beginner 1-Click Demo Shortcut */}
            <div className="pt-2">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-semibold uppercase">Or For Easy Project Evaluation</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin(activeTab)}
                className="w-full py-2.5 rounded-xl border border-slate-700 bg-[#07130b] hover:bg-white/5 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Instant Demo Login as {activeTab.toUpperCase()}</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
