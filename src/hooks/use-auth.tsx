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
  reminders_enabled: boolean;
  focus_mode_enabled: boolean;
};

export type PreferenceKey =
  | "push_enabled"
  | "voice_alerts_enabled"
  | "haptics_enabled"
  | "journal_lock_enabled"
  | "reminders_enabled"
  | "focus_mode_enabled";

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  /** Displayable (signed) URL for the stored avatar, if any. */
  avatarSrc: string | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  updatePreference: (key: PreferenceKey, value: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

/** Safe fallback so a transient missing provider (e.g. dev HMR) never blanks the app. */
const fallbackAuth: AuthState = {
  session: null,
  user: null,
  profile: null,
  avatarSrc: null,
  loading: true,
  refreshProfile: async () => {},
  updatePreference: async () => {},
  signOut: async () => {
    await supabase.auth.signOut();
  },
};

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
        "id, display_name, avatar_url, timezone, push_enabled, voice_alerts_enabled, haptics_enabled, journal_lock_enabled, reminders_enabled, focus_mode_enabled",
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

  const updatePreference = useCallback(
    async (key: PreferenceKey, value: boolean) => {
      if (!userId) return;
      const previous = profile;
      setProfile((p) => (p ? { ...p, [key]: value } : p));
      const { error } = await supabase
        .from("profiles")
        .update({ [key]: value } as Partial<Record<PreferenceKey, boolean>>)
        .eq("id", userId);
      if (error) {
        setProfile(previous);
        throw error;
      }
    },
    [userId, profile],
  );

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      avatarSrc,
      loading,
      refreshProfile,
      updatePreference,
      signOut,
    }),
    [session, profile, avatarSrc, loading, refreshProfile, updatePreference, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? fallbackAuth;
}