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

interface AuthContextType {
  user: UserProfile | null;
  login: (role: UserRole, customName?: string, customId?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const DEFAULT_PROFILES: Record<UserRole, UserProfile> = {
  farmer: {
    role: "farmer",
    name: "Ramesh Patel (Kisan)",
    identifier: "+91 98765-43210",
    address: DEMO_ROLES[0].address,
    avatarIcon: "🌾",
    tagline: "Certified Organic Wheat & Rice Cultivator"
  },
  seller: {
    role: "seller",
    name: "AgriGrow Seed Breeders Ltd.",
    identifier: "breeder@agrigrow.com",
    address: DEMO_ROLES[1].address,
    avatarIcon: "🏢",
    tagline: "ICAR-Accredited Foundation Seed Producer"
  },
  admin: {
    role: "admin",
    name: "Dr. K. Sharma (CA Officer)",
    identifier: "officer@seedcert.gov.in",
    address: DEMO_ROLES[2].address,
    avatarIcon: "🛡️",
    tagline: "National Seed Quality Certification Authority"
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("seedsure_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFILES.farmer;
      }
    }
    // Default friendly login for beginner exploration
    return DEFAULT_PROFILES.farmer;
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
      name: customName || base.name,
      identifier: customId || base.identifier
    };
    setUser(newProfile);
  };

  const logout = () => {
    setUser(null);
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
