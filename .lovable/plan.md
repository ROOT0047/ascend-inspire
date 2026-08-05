# ASCEND — Design Prototype (Phase 1)

A mobile-first web prototype of Project Ayanokoji. Every screen from your navigation exists and looks finished; the MVP screens behave realistically using in-memory mock data. No accounts, no database yet — that comes after you're happy with the look and flow.

Note: Flutter + Firebase aren't buildable here. This is the same product as a responsive web app (React), which later installs to a phone home screen. When we move past the prototype, Lovable Cloud replaces Firebase (auth, database, storage, AI) one-to-one.

## What you'll be able to click

**Full depth (feels real, data resets on reload)**
- Login — dark gradient, logo, "Discipline shapes destiny.", Google / Apple / Email buttons (visual, enters the app)
- Home — Good morning greeting, animated Discipline Score ring, stat row (tasks / habits / focus / streak), Today's Mission checklist, water + sleep, quote card
- Schedule — week strip, vertical timeline with color-coded blocks, current task highlighted, complete/reschedule, add-block sheet
- Habits — All/Daily/Weekly/Monthly filter, 30-dot streak grids, tap to complete, streak counters, add habit
- Focus — Pomodoro ring with real countdown, stopwatch tab, session counter, Deep Work toggle, short/long break
- Analytics — week/month/year toggle, discipline trend line, habit heatmap, focus hours, overview stat cards
- AI Coach — morning brief, night review and chat, with scripted responses in the prototype

**Shell screens (designed, lightly populated)**
- Learn, Health, Journal, Achievements, Profile, Settings, Reminders, Notifications, Sync status

## Design direction

Your palette and mood, refined for contrast and hierarchy:

- Base `#0B0F17`, surface `#141A24`, card `#1C2433`, divider `#2A3445`
- Primary violet `#7C5CFF` used sparingly — active nav, score ring, primary buttons only
- Secondary `#4DA3FF`, success `#22C55E`, warning `#F59E0B`, error `#EF4444`
- Text `#F5F7FA` / `#A1A9B8`
- Poppins SemiBold headings, Inter body, JetBrains Mono for every number and stat
- 20–24px card radius, hairline borders, one soft violet glow per screen maximum
- Motion: 200–300ms fades, ring and bar fill on mount, gentle press scale. Nothing bouncy.

Refinements over the mockup: tighter vertical rhythm, fewer competing glows, stronger numeric hierarchy so stats read at a glance, and a floating pill behind the active bottom-nav icon.

Bottom nav carries Home / Schedule / Focus / Analytics / Profile; the remaining sections (Habits, Learn, Health, Journal, AI Coach, Settings) live behind a drawer from the header, so the bar stays uncluttered.

## Technical notes

- React + TanStack Start, one route file per screen under `src/routes/`, each with its own SEO metadata
- Tokens defined as oklch variables in `src/styles.css` — no hardcoded colors in components
- Mock data in typed modules (`src/data/`) shaped exactly like your Firestore documents (schedule, habits, focus_sessions, journal, health, analytics, achievements), so swapping to the real backend later is a data-source change, not a rewrite
- Prototype state held in React context, seeded from mock data — completing a habit or task really updates the dashboard and score during a session
- Discipline score computed from the same weighted inputs you specified (sleep, workout, reading, focus, habits, journal, water, learning)
- Charts via Recharts, icons via Lucide at uniform stroke width

## Next steps after you approve the look

1. Lovable Cloud: email + Google auth, per-user row-level security, real persistence
2. Real reminders, voice (text-to-speech) and notifications
3. Live AI Coach on Lovable AI — morning brief, night review, chat, habit analysis
4. Phases 3–6: analytics depth, finance, knowledge hub, missions, XP and levels
