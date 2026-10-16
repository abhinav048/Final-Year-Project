import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";
import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext";
import {
  Sprout,
  ShoppingBag,
  Shield,
  Wallet,
  ChevronDown,
  LogOut,
  Check,
  Menu,
  X,
  Building2,
  ExternalLink,
  UserCheck
} from "lucide-react";
import { PillButton } from "./PillButton";

interface NavbarProps {
  onConnectWallet: () => void;
  isWalletConnected: boolean;
  onOpenOnboarding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onConnectWallet,
  isWalletConnected,
  onOpenOnboarding
}) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleNavClick = (path: string, e: React.MouseEvent) => {
    if (path.includes("#")) {
      e.preventDefault();
      const [, hash] = path.split("#");
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 150);
      } else {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { label: t("home", "Home"), path: "/" },
    { label: t("marketplace", "Marketplace"), path: "/marketplace" },
    { label: t("howItWorks", "How it works"), path: "/#how-it-works" },
    { label: t("trustScore", "Trust score"), path: "/#trust-score" },
    { label: t("verifyBag", "Verify Bag"), path: "/verify/seed/1" },
    { label: t("faq", "FAQ"), path: "/#faq" }
  ];

  const getPortalInfo = (role: UserRole) => {
    if (role === "farmer") return { label: t("farmerPortal", "Farmer Portal"), path: "/farmer", icon: "🌾" };
    if (role === "seller") return { label: t("breederHub", "Breeder Hub"), path: "/seller", icon: "🏢" };
    return { label: t("caConsole", "CA Console"), path: "/admin", icon: "🛡️" };
  };

  return (
    <header className="sticky top-4 z-40 w-full px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#F7F8F3]/95 backdrop-blur-md border border-[#E1E6DA] rounded-full px-3.5 sm:px-5 lg:px-6 py-2 shadow-[0_4px_20px_rgba(15,42,29,0.05)] flex items-center justify-between gap-2 sm:gap-4">
        {/* 1. Left: Two-Tone Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#EEF3E6] border border-[#D2ECC3] flex items-center justify-center text-[#6AB547] group-hover:scale-105 transition-transform shrink-0">
              <Sprout className="w-5 h-5 text-[#6AB547]" />
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-xl tracking-tight text-[#121714] whitespace-nowrap">
                Seed<span className="text-[#6AB547]">Sure</span>
              </span>
            </div>
          </Link>
        </div>

        {/* 2. Center: Desktop Navigation Links (Properly Centered) */}
        <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5 flex-1 max-w-2xl mx-auto">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(link.path, e)}
                className={`px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "text-[#121714] bg-[#EEF3E6] font-bold"
                    : "text-[#5B665F] hover:text-[#121714] hover:bg-white/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* If logged in, show their authorized portal link */}
          {user && (
            <Link
              to={getPortalInfo(user.role).path}
              className={`px-2.5 xl:px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ml-1 flex items-center gap-1.5 ${
                location.pathname === getPortalInfo(user.role).path
                  ? "bg-[#6AB547] text-white"
                  : "bg-[#EEF3E6] text-[#2E6F40] hover:bg-[#6AB547] hover:text-white"
              }`}
            >
              <span>{getPortalInfo(user.role).icon}</span>
              <span>{getPortalInfo(user.role).label}</span>
            </Link>
          )}
        </nav>

        {/* 3. Right: Utility Group (Language, Session / Login, Action, Hamburger) */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 shrink-0">
          {/* Language Selector (Tablet & Desktop; Mobile has it in Drawer) */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="h-9 px-2.5 rounded-full border border-[#E1E6DA] bg-white hover:bg-[#EEF3E6] text-xs font-bold text-[#121714] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Select Language"
            >
              <span>{activeLangObj.flag}</span>
              <span className="hidden md:inline">{activeLangObj.nativeName}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-[#5B665F] transition-transform ${
                  langMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-[#E1E6DA] shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-[#F1EFE6]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#5B665F]">
                    Select Language / भाषा
                  </p>
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#EEF3E6] transition-colors cursor-pointer ${
                      language === lang.code
                        ? "bg-[#EEF3E6] font-bold text-[#6AB547]"
                        : "text-[#121714]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-[#5B665F] font-normal">
                        ({lang.name})
                      </span>
                    </div>
                    {language === lang.code && (
                      <Check className="w-3.5 h-3.5 text-[#6AB547]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Session Profile & Strict Logout */}
          {user ? (
            <div className="flex items-center gap-1 sm:gap-1.5 bg-white border border-[#E1E6DA] rounded-full p-1 pl-2 sm:pl-2.5 shadow-xs">
              <span className="text-sm shrink-0">{user.avatarIcon}</span>
              <div className="hidden md:flex flex-col text-left leading-tight pr-1">
                <span className="text-[11px] font-extrabold text-[#121714] truncate max-w-[100px]">
                  {user.name.split(" ")[0]}
                </span>
                <span className="text-[9px] font-bold uppercase text-[#6AB547]">
                  {user.role}
                </span>
              </div>

              {/* Strict Logout Button */}
              <button
                onClick={handleLogout}
                title="Log Out completely"
                className="h-7 px-2 sm:px-2.5 rounded-full bg-[#FDF2F0] hover:bg-[#D8503F] text-[#D8503F] hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span className="hidden md:inline">{t("logout", "Log out")}</span>
              </button>
            </div>
          ) : (
            <div className="hidden sm:block">
              <Link to="/login">
                <PillButton variant="secondary" size="sm">
                  {t("login", "Log In")}
                </PillButton>
              </Link>
            </div>
          )}

          {/* Primary Action (Get Started if guest on desktop) */}
          {!user && (
            <div className="hidden lg:block">
              <PillButton
                variant="dark"
                size="sm"
                withArrow
                onClick={onConnectWallet}
              >
                {t("getStarted", "Get Started")}
              </PillButton>
            </div>
          )}

          {/* Wallet Connected Indicator (Desktop) */}
          {user && isWalletConnected && (
            <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EEF8F1] border border-[#B8E4C7] text-[#2E9E57] text-xs font-bold shadow-xs">
              <Wallet className="w-3.5 h-3.5" />
              <span>{t("walletConnected", "Wallet Connected")}</span>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full bg-white border border-[#E1E6DA] flex items-center justify-center text-[#121714] cursor-pointer hover:bg-[#EEF3E6] transition-colors shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-3xl bg-[#F7F8F3] border border-[#E1E6DA] shadow-xl space-y-3 animate-in fade-in duration-150">
          {/* Active User Header in Drawer */}
          {user ? (
            <div className="p-3 bg-white rounded-2xl border border-[#E1E6DA] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{user.avatarIcon}</span>
                <div>
                  <p className="text-xs font-extrabold text-[#121714]">{user.name}</p>
                  <p className="text-[10px] font-bold text-[#6AB547] uppercase">{user.role} Portal</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1 rounded-full bg-[#FDF2F0] text-[#D8503F] text-xs font-bold flex items-center gap-1 hover:bg-[#D8503F] hover:text-white transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>{t("logout", "Logout")}</span>
              </button>
            </div>
          ) : (
            <div className="sm:hidden">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <PillButton variant="primary" size="sm" className="w-full">
                  {t("login", "Log In to Portal")}
                </PillButton>
              </Link>
            </div>
          )}

          {/* Mobile Language Selector Row */}
          <div className="p-2.5 bg-white rounded-2xl border border-[#E1E6DA] sm:hidden">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5B665F] mb-1.5 px-1">
              Select Language / भाषा
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    language === lang.code
                      ? "bg-[#EEF3E6] font-bold text-[#6AB547]"
                      : "hover:bg-[#F7F8F3] text-[#121714]"
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </span>
                  {language === lang.code && <Check className="w-3 h-3 text-[#6AB547]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Links List */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(link.path, e)}
                className="block px-4 py-2 rounded-xl text-xs font-bold text-[#121714] hover:bg-[#EEF3E6] transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {user && (
              <Link
                to={getPortalInfo(user.role).path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-xl text-xs font-extrabold bg-[#EEF3E6] text-[#2E6F40]"
              >
                Go to {getPortalInfo(user.role).label}
              </Link>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 border-t border-[#E1E6DA] flex flex-col gap-2">
            {!isWalletConnected && (
              <PillButton
                variant="dark"
                size="sm"
                withArrow
                onClick={() => {
                  onConnectWallet();
                  setMobileMenuOpen(false);
                }}
              >
                {t("connectWallet", "Connect Wallet")}
              </PillButton>
            )}
            {onOpenOnboarding && (
              <PillButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  onOpenOnboarding();
                  setMobileMenuOpen(false);
                }}
              >
                {t("beginnerTour", "Beginner Tour")}
              </PillButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
