import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

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

export type AuthState = {
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

/**
 * The context object is cached on globalThis so a hot-reload of the provider
 * module reuses the exact same context instance. Without this, HMR creates a
 * fresh context while mounted consumers still read the old one, which makes
 * `useAuth` see `null` and blanks routes like the login screen.
 */
const KEY = "__ascend_auth_context__";
const globalStore = globalThis as typeof globalThis & {
  [KEY]?: ReturnType<typeof createContext<AuthState | null>>;
};

export const AuthContext =
  globalStore[KEY] ?? (globalStore[KEY] = createContext<AuthState | null>(null));