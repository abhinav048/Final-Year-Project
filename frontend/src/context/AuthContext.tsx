import React, { createContext, useContext, useState, useEffect } from "react";
import { DEMO_ROLES } from "../web3";

export type UserRole = "farmer" | "seller" | "admin";

export interface UserProfile {
  role: UserRole;
  name: string;
  identifier: string; // Phone, Email, or Govt ID
  address: string;
  avatarIcon: string;
  tagline: string;
}

export interface DemoCredentialInfo {
  role: UserRole;
  roleTitle: string;
  identifierLabel: string;
  identifier: string;
  alternateEmail: string;
  password: string;
  name: string;
  portalName: string;
  portalRoute: string;
  ethAddress: string;
  icon: string;
  permissions: string;
}

export const DEMO_CREDENTIALS: DemoCredentialInfo[] = [
  {
    role: "farmer",
    roleTitle: "Farmer (Kisan)",
    identifierLabel: "Mobile Number / Kisan ID",
    identifier: "+91 98765-43210",
    alternateEmail: "farmer@seedsure.org",
    password: "seedsure123",
    name: "Ramesh Patel (Kisan)",
    portalName: "Farmer Portal",
    portalRoute: "/farmer",
    ethAddress: DEMO_ROLES[0]?.address || "0x976EA74026E726554dB657fA54763abd0C3a0aa9",
    icon: "🌾",
    permissions: "Browse seeds, escrow purchases, inspect delivery, raise disputes, release escrow."
  },
  {
    role: "seller",
    roleTitle: "Seed Breeder / Seller",
    identifierLabel: "Official Breeder Email",
    identifier: "breeder@agrigrow.com",
    alternateEmail: "breeder@agrigrow.com",
    password: "seedsure123",
    name: "AgriGrow Seed Breeders Ltd.",
    portalName: "Breeder Hub",
    portalRoute: "/seller",
    ethAddress: DEMO_ROLES[1]?.address || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    icon: "🏢",
    permissions: "Register seed batches, upload lab test reports, dispatch orders, track trust score."
  },
  {
    role: "admin",
    roleTitle: "Certification Authority (CA)",
    identifierLabel: "Govt CA Badge ID / Email",
    identifier: "CA-ICAR-OFFICER-771",
    alternateEmail: "officer@seedcert.gov.in",
    password: "seedsure123",
    name: "Dr. K. Sharma (CA Officer)",
    portalName: "CA Console",
    portalRoute: "/admin",
    ethAddress: DEMO_ROLES[2]?.address || "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    icon: "🛡️",
    permissions: "Audit lab test certificates, verify on-chain hashes, arbitrate disputes, enforce trust threshold."
  }
];

export const DEFAULT_PROFILES: Record<UserRole, UserProfile> = {
  farmer: {
    role: "farmer",
    name: "Ramesh Patel (Kisan)",
    identifier: "+91 98765-43210",
    address: DEMO_CREDENTIALS[0].ethAddress,
    avatarIcon: "🌾",
    tagline: "Certified Organic Wheat & Rice Cultivator"
  },
  seller: {
    role: "seller",
    name: "AgriGrow Seed Breeders Ltd.",
    identifier: "breeder@agrigrow.com",
    address: DEMO_CREDENTIALS[1].ethAddress,
    avatarIcon: "🏢",
    tagline: "ICAR-Accredited Foundation Seed Producer"
  },
  admin: {
    role: "admin",
    name: "Dr. K. Sharma (CA Officer)",
    identifier: "CA-ICAR-OFFICER-771",
    address: DEMO_CREDENTIALS[2].ethAddress,
    avatarIcon: "🛡️",
    tagline: "National Seed Quality Certification Authority"
  }
};

interface AuthContextType {
  user: UserProfile | null;
  login: (role: UserRole, customName?: string, customId?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // STRICT AUTHENTICATION:
  // Starts with null if not logged in. No automatic fallback to farmer!
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("seedsure_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role && parsed.address) {
          return parsed;
        }
      } catch (e) {
        localStorage.removeItem("seedsure_user");
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("seedsure_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("seedsure_user");
    }
  }, [user]);

  const login = (role: UserRole, customName?: string, customId?: string) => {
    const base = DEFAULT_PROFILES[role];
    const newProfile: UserProfile = {
      ...base,
      name: customName?.trim() || base.name,
      identifier: customId?.trim() || base.identifier
    };
    setUser(newProfile);
    localStorage.setItem("seedsure_user", JSON.stringify(newProfile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("seedsure_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
