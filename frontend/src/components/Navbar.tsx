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
  LogIn,
  QrCode,
  HelpCircle,
  Building2,
  Check,
  Boxes,
  Menu,
  X
} from "lucide-react";

interface NavbarProps {
  onConnectWallet: () => void;
  isWalletConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onConnectWallet,
  isWalletConnected
}) => {
  const { user, logout, login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dynamic navigation links fully translated via useLanguage
  const getNavLinks = () => {
    if (!user) {
      return [
        { label: t("marketplace"), path: "/marketplace", icon: ShoppingBag },
        { label: t("ethereumEscrow"), path: "/blockchain", icon: Boxes },
        { label: t("howToUse"), path: "/#how-to-use", icon: HelpCircle },
      ];
    }

    if (user.role === "farmer") {
      return [
        { label: t("marketplace"), path: "/marketplace", icon: ShoppingBag },
        { label: t("ethereumEscrow"), path: "/blockchain", icon: Boxes },
        { label: t("howToUse"), path: "/#how-to-use", icon: HelpCircle },
        { label: t("farmerPortal"), path: "/farmer", icon: Sprout },
        { label: t("verifyBag"), path: "/verify/seed/1", icon: QrCode },
      ];
    }

    if (user.role === "seller") {
      return [
        { label: t("marketplace"), path: "/marketplace", icon: ShoppingBag },
        { label: t("ethereumEscrow"), path: "/blockchain", icon: Boxes },
        { label: t("howToUse"), path: "/#how-to-use", icon: HelpCircle },
        { label: t("breederHub"), path: "/seller", icon: Building2 },
        { label: t("verifyBag"), path: "/verify/seed/1", icon: QrCode },
      ];
    }

    // Admin / CA
    return [
      { label: t("marketplace"), path: "/marketplace", icon: ShoppingBag },
      { label: t("ethereumEscrow"), path: "/blockchain", icon: Boxes },
      { label: t("howToUse"), path: "/#how-to-use", icon: HelpCircle },
      { label: t("caConsole"), path: "/admin", icon: Shield },
      { label: t("verifyBag"), path: "/verify/seed/1", icon: QrCode },
    ];
  };

  const navLinks = getNavLinks();
  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

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

  return (
    <header className="sticky top-0 z-40 w-full glass-nav border-b border-[#48A741]/20 bg-[#07130b]/92 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">

        {/* 1. Sleek Brand (Matches Theme with Seed in White & Sure in #48A741) */}
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#48A741] to-emerald-800 flex items-center justify-center text-white shadow-md shadow-[#48A741]/30 group-hover:scale-105 transition-transform">
            <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="font-display font-black text-lg sm:text-xl text-white tracking-tight">
              Seed<span className="text-[#48A741]">Sure</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/30 tracking-wider">
              AGRI
            </span>
          </div>
        </Link>

        {/* 2. Centered Segmented Navigation Pills (Visible on lg+ screens) */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#0a1f11]/80 p-1 rounded-2xl border border-[#48A741]/20 shadow-inner">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(link.path, e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${isActive
                    ? "bg-[#48A741] text-white shadow-md shadow-[#48A741]/30 font-bold"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#48A741]"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. Utility Group: Language, Profile, Wallet (Uniform h-9 height & crisp alignment) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setLangMenuOpen(!langMenuOpen);
                setRoleMenuOpen(false);
              }}
              className="h-9 px-2 sm:px-2.5 rounded-xl border border-[#48A741]/25 bg-[#0a1f11]/80 hover:bg-[#0f2c19] text-xs font-bold text-slate-200 hover:text-white shadow-xs flex items-center gap-1.5 transition-all"
              title="Select Platform Language"
            >
              <span className="text-sm">{activeLangObj.flag}</span>
              <span className="hidden sm:inline font-semibold">{activeLangObj.nativeName}</span>
              <span className="sm:hidden font-bold">{activeLangObj.code.toUpperCase()}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${langMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#07160d] border border-[#48A741]/30 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 border-b border-emerald-950/80">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-[#48A741]/20 transition-colors ${language === lang.code ? "bg-[#48A741]/25 font-bold text-[#48A741]" : "text-slate-200"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({lang.name})</span>
                    </div>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-[#48A741]" />}
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
                className="h-9 px-2 sm:px-2.5 rounded-xl border border-[#48A741]/25 bg-[#0a1f11]/80 hover:bg-[#0f2c19] text-xs font-semibold text-slate-200 hover:text-white shadow-xs flex items-center gap-1.5 sm:gap-2 transition-all max-w-[140px] sm:max-w-[210px]"
                title="Current Account & Switch Portal"
              >
                <span className="text-sm shrink-0">{user.avatarIcon}</span>
                <span className="font-bold text-white truncate text-[11px] sm:text-xs">
                  {user.name.split(" ")[0]}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] uppercase font-bold bg-[#48A741]/20 text-[#48A741] border border-[#48A741]/30 shrink-0">
                  {user.role}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${roleMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#07160d] border border-[#48A741]/30 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-emerald-950/80">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Logged In As
                    </p>
                    <p className="font-bold text-xs text-white truncate">{user.name}</p>
                    <p className="text-[10px] font-mono text-slate-400 truncate">{user.identifier}</p>
                  </div>

                  <div className="py-1">
                    <p className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase">
                      {t("switchPortal")}
                    </p>
                    <button
                      onClick={() => {
                        login("farmer");
                        setRoleMenuOpen(false);
                        navigate("/marketplace");
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-[#48A741]/20 ${user.role === "farmer" ? "text-[#48A741] font-bold bg-[#48A741]/10" : "text-slate-200"
                        }`}
                    >
                      <span>🌾</span>
                      <span>Farmer Portal (Buyer)</span>
                    </button>
                    <button
                      onClick={() => {
                        login("seller");
                        setRoleMenuOpen(false);
                        navigate("/seller");
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-[#48A741]/20 ${user.role === "seller" ? "text-blue-400 font-bold bg-blue-950/30" : "text-slate-200"
                        }`}
                    >
                      <span>🏢</span>
                      <span>Seed Breeder Hub</span>
                    </button>
                    <button
                      onClick={() => {
                        login("admin");
                        setRoleMenuOpen(false);
                        navigate("/admin");
                      }}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 hover:bg-[#48A741]/20 ${user.role === "admin" ? "text-purple-400 font-bold bg-purple-950/30" : "text-slate-200"
                        }`}
                    >
                      <span>🛡️</span>
                      <span>CA & Admin Console</span>
                    </button>
                  </div>

                  <div className="border-t border-emerald-950/80 pt-1 mt-1">
                    <button
                      onClick={() => {
                        logout();
                        setRoleMenuOpen(false);
                        navigate("/login");
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-400 font-semibold hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t("logout")}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="h-9 px-3 rounded-xl bg-[#48A741] hover:bg-[#3d9136] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t("login")}</span>
            </Link>
          )}

          {/* Web3 Wallet Connect Pill */}
          <button
            onClick={onConnectWallet}
            className={`h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all ${isWalletConnected
                ? "bg-[#48A741]/25 text-[#48A741] border border-[#48A741]/50"
                : "bg-[#0a1f11]/80 hover:bg-[#0f2c19] text-slate-200 border border-[#48A741]/25"
              }`}
            title="Connect MetaMask Wallet (Optional - Demo Active)"
          >
            <Wallet className="w-3.5 h-3.5 text-[#48A741] shrink-0" />
            <span className="hidden md:inline">
              {isWalletConnected ? t("walletConnected") : t("connectWallet")}
            </span>
          </button>

          {/* Mobile Menu Toggle Button (Visible on screens < lg) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-9 w-9 rounded-xl border border-[#48A741]/25 bg-[#0a1f11]/80 hover:bg-[#0f2c19] flex items-center justify-center text-slate-200 hover:text-white shadow-xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer Navigation (Responsive overlay with identical color theme) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#48A741]/30 bg-[#07130b] px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-150">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Navigation Menu
          </p>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(link.path, e)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive
                    ? "bg-[#48A741] text-white shadow-md shadow-[#48A741]/30"
                    : "text-slate-300 hover:text-white hover:bg-[#0a1f11]"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#48A741]"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
