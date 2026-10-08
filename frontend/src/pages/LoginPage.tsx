import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, UserRole, DEMO_CREDENTIALS } from "../context/AuthContext";
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
  Info,
  Copy,
  Check
} from "lucide-react";

export const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.from
    ? `You must sign in with authorized credentials to access ${location.state.from}.`
    : null;

  const [activeTab, setActiveTab] = useState<UserRole>("farmer");
  const [identifierInput, setIdentifierInput] = useState(DEMO_CREDENTIALS[0].identifier);
  const [passwordInput, setPasswordInput] = useState(DEMO_CREDENTIALS[0].password);
  const [nameInput, setNameInput] = useState(DEMO_CREDENTIALS[0].name);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeCreds = DEMO_CREDENTIALS.find((c) => c.role === activeTab)!;

  const handleTabChange = (role: UserRole) => {
    setActiveTab(role);
    const target = DEMO_CREDENTIALS.find((c) => c.role === role)!;
    setIdentifierInput(target.identifier);
    setPasswordInput(target.password);
    setNameInput(target.name);
    setErrorMessage(null);
  };

  const handleCopyCredentials = (role: UserRole) => {
    const cred = DEMO_CREDENTIALS.find((c) => c.role === role)!;
    const text = `Role: ${cred.roleTitle}\nID: ${cred.identifier}\nPassword: ${cred.password}`;
    navigator.clipboard.writeText(text);
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic credentials validation
    if (!identifierInput.trim()) {
      setErrorMessage("Please enter your registered ID or Phone.");
      return;
    }
    if (!passwordInput || passwordInput.length < 4) {
      setErrorMessage("Please enter your passcode (demo: seedsure123).");
      return;
    }

    login(activeTab, nameInput, identifierInput);

    // Redirect to their specific dashboard
    if (activeTab === "farmer") {
      navigate("/farmer");
    } else if (activeTab === "seller") {
      navigate("/seller");
    } else {
      navigate("/admin");
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    const cred = DEMO_CREDENTIALS.find((c) => c.role === role)!;
    login(role, cred.name, cred.identifier);
    if (role === "farmer") navigate("/farmer");
    else if (role === "seller") navigate("/seller");
    else navigate("/admin");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="sheet-surface wave-pattern border border-[#E1E6DA] p-6 sm:p-10 shadow-sheet space-y-8 bg-white">
        
        {/* Header Greeting */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <TagPill icon={<Sparkles className="w-3.5 h-3.5 text-[#6AB547]" />}>
              Role-Based Authentication System
            </TagPill>
          </div>
          <h1 className="font-extrabold text-3xl sm:text-4xl text-[#121714] tracking-tight">
            Sign In to Seed<span className="text-[#6AB547]">Sure</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5B665F] max-w-lg mx-auto">
            Choose your role to access your dedicated portal. Only one role is active per session; logging in as Farmer, Breeder, or CA protects against cross-role actions.
          </p>

          {redirectMessage && (
            <div className="mt-3 p-3 rounded-2xl bg-[#FFF6E5] border border-[#F6D38B] text-[#9A6208] text-xs font-semibold max-w-md mx-auto flex items-center justify-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>{redirectMessage}</span>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* CREDENTIALS REFERENCE BOX (Saved in docs/CREDENTIALS.md) */}
        {/* ======================================================== */}
        <div className="rounded-2xl border border-[#D2ECC3] bg-[#F4F9EE] p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-[#DDEFD1]">
            <div className="flex items-center gap-2">
              <span className="text-base">📋</span>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#121714]">
                Official Demo Credentials Reference (Saved in <code className="text-[#2E6F40] bg-white px-1.5 py-0.5 rounded font-mono">CREDENTIALS.md</code>)
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#5B665F]">
              Click any card to auto-fill or sign in
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DEMO_CREDENTIALS.map((cred) => {
              const isSelected = activeTab === cred.role;
              return (
                <div
                  key={cred.role}
                  className={`p-3.5 rounded-xl border transition-all text-left bg-white ${
                    isSelected
                      ? "border-[#6AB547] ring-2 ring-[#6AB547]/20 shadow-xs"
                      : "border-[#E1E6DA] hover:border-[#6AB547]/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{cred.icon}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCredentials(cred.role)}
                      className="p-1 rounded-md text-[#5B665F] hover:text-[#121714] hover:bg-[#EEF3E6] transition-colors"
                      title="Copy credentials"
                    >
                      {copiedRole === cred.role ? (
                        <Check className="w-3.5 h-3.5 text-[#2E9E57]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <p className="font-extrabold text-xs text-[#121714]">{cred.roleTitle}</p>
                  <div className="mt-1.5 text-[11px] space-y-0.5 font-mono text-[#5B665F]">
                    <p className="truncate"><span className="text-[#96A09A]">ID:</span> <strong className="text-[#121714]">{cred.identifier}</strong></p>
                    <p><span className="text-[#96A09A]">Pass:</span> <strong className="text-[#121714]">{cred.password}</strong></p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#F1EFE6] flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleTabChange(cred.role)}
                      className="text-[10px] font-bold text-[#2E6F40] hover:underline"
                    >
                      Use Form
                    </button>
                    <span className="text-[#E1E6DA]">|</span>
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin(cred.role)}
                      className="text-[10px] font-extrabold text-[#6AB547] hover:underline"
                    >
                      Instant Login →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3 Role Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_CREDENTIALS.map((cred) => (
            <button
              key={cred.role}
              type="button"
              onClick={() => handleTabChange(cred.role)}
              className={`p-4 rounded-[20px] border text-left transition-all cursor-pointer ${
                activeTab === cred.role
                  ? "bg-[#EEF3E6] border-[#6AB547] shadow-xs"
                  : "bg-white border-[#E1E6DA] hover:bg-[#F7F8F3]"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E1E6DA] text-[#6AB547] flex items-center justify-center mb-2.5 text-xl">
                {cred.icon}
              </div>
              <h3 className="font-extrabold text-sm text-[#121714]">{cred.portalName}</h3>
              <p className="text-[11px] text-[#5B665F] mt-0.5 leading-snug truncate">
                {cred.name}
              </p>
            </button>
          ))}
        </div>

        {/* Login Form Container */}
        <div className="bg-[#F7F8F3] rounded-[24px] border border-[#E1E6DA] p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[#E1E6DA]">
            <h2 className="font-extrabold text-lg text-[#121714] flex items-center gap-2">
              <span>{activeCreds.icon}</span>
              <span>Sign In as {activeCreds.roleTitle}</span>
            </h2>
            <p className="text-xs text-[#5B665F] mt-0.5">
              Permissions: {activeCreds.permissions}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#FDF2F0] border border-[#F8D5D0] text-[#D8503F] text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-[#121714] block mb-1">
                Name / Enterprise
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-bold text-[#121714]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#121714] block mb-1">
                {activeCreds.identifierLabel}
              </label>
              <input
                type="text"
                required
                value={identifierInput}
                onChange={(e) => setIdentifierInput(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono text-[#121714]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#121714] block mb-1">
                Security Passcode
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-[#E1E6DA] bg-white font-mono text-[#121714]"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <PillButton
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleQuickDemoLogin(activeTab)}
              >
                Instant 1-Click Sign In
              </PillButton>

              <PillButton
                type="submit"
                variant="primary"
                size="md"
                withArrow
              >
                Sign In & Open {activeCreds.portalName}
              </PillButton>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
