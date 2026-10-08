import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../context/AuthContext";
import { PillButton } from "./PillButton";
import { TagPill } from "./TagPill";
import { ShieldAlert, LogOut, ArrowRight, Lock } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Not Authenticated at all -> Redirect to Login
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 2. Authenticated, but Wrong Role -> Strict Access Denied Screen
  if (!allowedRoles.includes(user.role)) {
    const roleLabels: Record<UserRole, string> = {
      farmer: "Farmer Portal",
      seller: "Breeder Hub",
      admin: "CA Console"
    };

    const targetPortalName = allowedRoles.map((r) => roleLabels[r]).join(" or ");
    const currentPortalName = roleLabels[user.role];

    const getPortalRoute = (role: UserRole) => {
      if (role === "farmer") return "/farmer";
      if (role === "seller") return "/seller";
      return "/admin";
    };

    const handleSwitchAccount = () => {
      logout();
      navigate("/login", { state: { requiredRole: allowedRoles[0] } });
    };

    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="sheet-surface border border-[#E1E6DA] p-8 sm:p-10 shadow-sheet text-center space-y-6 bg-white">
          <div className="w-16 h-16 rounded-full bg-[#FDF2F0] border border-[#F8D5D0] text-[#D8503F] flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-center">
              <TagPill icon={<Lock className="w-3.5 h-3.5 text-[#D8503F]" />}>
                Access Restricted
              </TagPill>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#121714]">
              Unauthorized Portal Access
            </h1>
            <p className="text-xs sm:text-sm text-[#5B665F] max-w-md mx-auto leading-relaxed">
              You are currently logged in as{" "}
              <strong className="text-[#121714] font-bold">{user.name}</strong> ({user.role.toUpperCase()}).
              This area is restricted to{" "}
              <strong className="text-[#121714] font-bold">{targetPortalName}</strong> credentials only.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F8F3] border border-[#E1E6DA] text-xs text-[#5B665F] text-left space-y-2">
            <p className="font-bold text-[#121714]">🔒 Role-Based Access Control (RBAC) Enforced:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Each SeedSure portal requires verified role permissions.</li>
              <li>Farmers cannot alter breeder listings or CA certificates.</li>
              <li>Breeders cannot arbitrate farmer escrows.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <PillButton
              variant="primary"
              size="md"
              withArrow
              onClick={() => navigate(getPortalRoute(user.role))}
            >
              Go to Your {currentPortalName}
            </PillButton>

            <PillButton
              variant="secondary"
              size="md"
              onClick={handleSwitchAccount}
            >
              <LogOut className="w-4 h-4 mr-1 text-[#D8503F]" />
              Log Out & Switch Account
            </PillButton>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized -> Render Portal
  return <>{children}</>;
};
