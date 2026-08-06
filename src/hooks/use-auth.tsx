import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  timezone: string;
  push_enabled: boolean;
  voice_alerts_enabled: boolean;
  haptics_enabled: boolean;
  journal_lock_enabled: boolean;
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  /** Displayable (signed) URL for the stored avatar, if any. */
  avatarSrc: string | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;

  const refreshProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setAvatarSrc(null);
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select(
        "id, display_name, avatar_url, timezone, push_enabled, voice_alerts_enabled, haptics_enabled, journal_lock_enabled",
      )
      .eq("id", userId)
      .maybeSingle();
    setProfile(data ?? null);

    const path = data?.avatar_url ?? null;
    if (!path) {
      setAvatarSrc(null);
    } else if (path.startsWith("http")) {
      setAvatarSrc(path);
    } else {
      const { data: signed } = await supabase.storage
        .from("avatars")
        .createSignedUrl(path, 60 * 60);
      setAvatarSrc(signed?.signedUrl ?? null);
    }
  }, [userId]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setAvatarSrc(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      avatarSrc,
      loading,
      refreshProfile,
      signOut,
    }),
    [session, profile, avatarSrc, loading, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}