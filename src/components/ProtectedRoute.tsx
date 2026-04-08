import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle } from "lucide-react";

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { user, loading, sessionExpired, clearSessionExpired } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    );
  }

  if (!user) {
    // Preserve where the user was trying to go so Login can redirect back
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
          expired: sessionExpired,
        }}
      />
    );
  }

  // Session-expired banner — shown once after being auto-signed-out
  const expiredBanner = sessionExpired ? (
    <div className="flex items-center gap-3 px-4 py-3 bg-warning/10 border-b border-warning/20 text-sm text-warning-foreground">
      <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
      <span>Your session expired and you were signed back in automatically.</span>
      <button
        onClick={clearSessionExpired}
        className="ml-auto text-xs underline hover:no-underline"
      >
        Dismiss
      </button>
    </div>
  ) : null;

  if (children) {
    return (
      <>
        {expiredBanner}
        {children}
      </>
    );
  }

  return (
    <>
      {expiredBanner}
      <Outlet />
    </>
  );
}
