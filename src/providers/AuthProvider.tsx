import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import * as authService from "@/services/authService";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignUp = useCallback(async (email: string, password: string) => {
    await authService.signUp(email, password);
  }, []);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    await authService.signIn(email, password);
  }, []);

  const handleSignOut = useCallback(async () => {
    await authService.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      signUp: handleSignUp,
      signIn: handleSignIn,
      signOut: handleSignOut,
    }),
    [user, session, loading, handleSignUp, handleSignIn, handleSignOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
