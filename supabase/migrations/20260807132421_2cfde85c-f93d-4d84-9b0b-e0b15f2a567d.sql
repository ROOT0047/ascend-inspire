ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS reminders_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS focus_mode_enabled boolean NOT NULL DEFAULT true;