import { Navigate, useLocation } from "react-router-dom";
import { useAdminData } from "@/contexts/AdminDataContext";
import type { ReactNode } from "react";

/**
 * Route guard. If the admin isn't authenticated, redirects to /admin/login
 * preserving the original path so we can return after login.
 */
export const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAdminData();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
