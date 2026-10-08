import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "../context/LanguageContext";
import {
  Sprout,
  ShoppingBag,
  Shield,
  Wallet,
  ChevronDown,
  LogOut,
  QrCode,
  HelpCircle,
  Building2,
  Check,
  Menu,
  X,
  Palette,
  ExternalLink
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
  const { user, logout, login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
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

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "How it works", path: "/#how-it-works" },
    { label: "Marketplace", path: "/marketplace" },
    { label: "Trust score", path: "/#trust-score" },
    { label: "FAQ", path: "/#faq" },
    { label: "Design System", path: "/design-system" }
  ];

  return (
    <header className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#F7F8F3]/95 backdrop-blur-md border border-[#E1E6DA] rounded-full px-4 sm:px-6 py-2.5 shadow-[0_4px_20px_rgba(15,42,29,0.05)] flex items-center justify-between gap-3">
        {/* 1. Two-Tone Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#EEF3E6] border border-[#D2ECC3] flex items-center justify-center text-[#6AB547] group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5 text-[#6AB547]" />
          </div>
          <div className="flex items-center">
            <span className="font-extrabold text-xl tracking-tight text-[#121714]">
              Seed<span className="text-[#6AB547]">Sure</span>
            </span>
          </div>
        </Link>

        {/* 2. Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(link.path, e)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? "text-[#121714] bg-[#EEF3E6] font-bold"
                    : "text-[#5B665F] hover:text-[#121714] hover:bg-white/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. Utility Group: Language, Role Switcher, Wallet / Get Started */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLangMenuOpen(!langMenuOpen);
                setRoleMenuOpen(false);
              }}
              className="h-9 px-2.5 rounded-full border border-[#E1E6DA] bg-white hover:bg-[#EEF3E6] text-xs font-bold text-[#121714] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              title="Select Language"
            >
              <span>{activeLangObj.flag}</span>
              <span className="hidden sm:inline">{activeLangObj.nativeName}</span>
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

          {/* User Profile / Portal Switcher */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setRoleMenuOpen(!roleMenuOpen);
                  setLangMenuOpen(false);
                }}
                className="h-9 px-3 rounded-full border border-[#E1E6DA] bg-white hover:bg-[#EEF3E6] text-xs font-bold text-[#121714] flex items-center gap-1.5 transition-all cursor-pointer shadow-xs max-w-[160px]"
                title="Switch Portal"
              >
                <span>{user.avatarIcon}</span>
                <span className="truncate">{user.name.split(" ")[0]}</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-[#EEF3E6] text-[#6AB547]">
                  {user.role}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#5B665F]" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E1E6DA] shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-[#F1EFE6]">
                    <p className="text-[10px] uppercase font-bold text-[#5B665F]">
                      Active Portal
                    </p>
                    <p className="font-bold text-xs text-[#121714]">{user.name}</p>
                  </div>
                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        login("farmer");
                        setRoleMenuOpen(false);
                        navigate("/farmer");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#EEF3E6] flex items-center gap-2 text-[#121714] cursor-pointer"
                    >
                      <span>🌾</span>
                      <span>Farmer Portal</span>
                    </button>
                    <button
                      onClick={() => {
                        login("seller");
                        setRoleMenuOpen(false);
                        navigate("/seller");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#EEF3E6] flex items-center gap-2 text-[#121714] cursor-pointer"
                    >
                      <span>🏢</span>
                      <span>Breeder Hub</span>
                    </button>
                    <button
                      onClick={() => {
                        login("admin");
                        setRoleMenuOpen(false);
                        navigate("/admin");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#EEF3E6] flex items-center gap-2 text-[#121714] cursor-pointer"
                    >
                      <span>🛡️</span>
                      <span>CA Console</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <PillButton variant="secondary" size="sm">
                Log In
              </PillButton>
            </Link>
          )}

          {/* Wallet / Get Started Primary Action */}
          {isWalletConnected ? (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EEF8F1] border border-[#B8E4C7] text-[#2E9E57] text-xs font-bold shadow-xs">
              <Wallet className="w-3.5 h-3.5" />
              <span>Wallet Connected</span>
            </div>
          ) : (
            <PillButton
              variant="dark"
              size="sm"
              withArrow
              onClick={onConnectWallet}
              className="hidden sm:inline-flex"
            >
              Get Started
            </PillButton>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-9 h-9 rounded-full bg-white border border-[#E1E6DA] flex items-center justify-center text-[#121714] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 p-4 rounded-3xl bg-[#F7F8F3] border border-[#E1E6DA] shadow-xl space-y-2 animate-in fade-in duration-150">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={(e) => handleNavClick(link.path, e)}
              className="block px-4 py-2.5 rounded-2xl text-xs font-bold text-[#121714] hover:bg-[#EEF3E6]"
            >
              {link.label}
            </Link>
          ))}

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
                Connect Wallet
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
                Beginner Tour
              </PillButton>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
