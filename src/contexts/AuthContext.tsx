import {
  createContext, useContext, useEffect, useState, useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session, AuthChangeEvent } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /** True when the previous session token expired and the user was signed out */
  sessionExpired: boolean;
  signOut: () => Promise<void>;
  clearSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  sessionExpired: false,
  signOut: async () => {},
  clearSessionExpired: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    // Hydrate from existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen to all auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session) => {
        switch (event) {
          case "INITIAL_SESSION":
          case "SIGNED_IN":
          case "USER_UPDATED":
            setSession(session);
            setUser(session?.user ?? null);
            setSessionExpired(false);
            break;

          case "TOKEN_REFRESHED":
            // Supabase auto-refreshed the JWT — update session silently
            setSession(session);
            setUser(session?.user ?? null);
            break;

          case "SIGNED_OUT":
            // Distinguish between manual sign-out and token expiry.
            // If we still had a session before this event, it was a forced expiry.
            setSession((prev) => {
              if (prev) setSessionExpired(true);
              return null;
            });
            setUser(null);
            break;

          default:
            break;
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    setSessionExpired(false);
    await supabase.auth.signOut();
  }, []);

  const clearSessionExpired = useCallback(() => setSessionExpired(false), []);

  return (
    <AuthContext.Provider value={{ user, session, loading, sessionExpired, signOut, clearSessionExpired }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
