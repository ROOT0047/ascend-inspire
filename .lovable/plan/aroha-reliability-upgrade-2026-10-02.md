# AROHA reliability upgrade

Keep the current dark mobile look, routes, sign-in and existing user data. Work in three phases so each one can be checked before the next.

## Phase 1 — Data that survives a refresh
- New daily log per user per date: water (ml), sleep (hours), mood, energy, weight (optional), notes.
- New focus sessions record: start, duration, linked block or goal, completed flag.
- Home water/sleep cards, Health page and Focus timer save to and load from these records instead of temporary state and sample data.
- Analytics and Level use the real focus minutes, sleep and water history.

## Phase 2 — Trust and feedback
- Success and error pop-ups for every save, delete, check-in and completion; buttons disable while saving.
- Goals: title required (max 120 chars), "why" max 500, progress 0–100, target date not in the past.
- XP rules written in one place: habit check-in, finished block, focus session, journal entry, goal milestone, daily health log. Same action on the same day cannot be counted twice.
- Clean up old "Ascend" names left inside the app code; the `/ascend` page stays at the same address (with a new `/aroha` address pointing to it).

## Phase 3 — The AROHA loop on Home
- A "Today's loop" strip: Goal → Plan → Mission → Focus → Habit → Journal → Review → Level Up, each step showing done or not done today and linking to its page.
- Daily mission list pulls from active goals plus today's blocks.

## Verification
Sign in, add and update a goal, check in a habit, finish a block, run a focus session, log water/sleep, refresh to confirm everything persists, confirm XP updates once, and open a notification link.

## Technical details
- Migration: `daily_logs` (user_id, log_date, water_ml, sleep_hours, mood, energy, weight_kg, notes; unique user_id+log_date) and `focus_sessions` (user_id, started_at, duration_min, block_id nullable, goal_id nullable, completed). GRANTs to authenticated/service_role, RLS scoped to `auth.uid() = user_id`, updated_at trigger.
- Queries/mutations added to `src/context/ascend.tsx` via TanStack Query with upsert by date; `sonner` Toaster mounted once in `__root.tsx`.
- Zod schemas for goal, daily log and focus session inputs.
- XP calculation extracted to `src/lib/xp.ts`, deduped by (source, id, date).
- Rename internal `Ascend*` identifiers to `Aroha*`; add `src/routes/aroha.tsx` redirecting to `/ascend`.
- Unique head() metadata on any route still missing it.
