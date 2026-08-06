ALTER TABLE public.profiles
  ADD COLUMN timezone TEXT NOT NULL DEFAULT 'UTC',
  ADD COLUMN push_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN voice_alerts_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN haptics_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN journal_lock_enabled BOOLEAN NOT NULL DEFAULT false;