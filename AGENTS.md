<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep application state and shared app UI in `src/context/aroha.tsx` and `src/components/aroha/`, using `ArohaProvider` and `useAroha`, so brand-specific imports remain consistent.
- Serve the brand page at `/aroha` and retain `/ascend` only as a permanent compatibility redirect so old bookmarks keep working.
- Keep legacy device-storage names only in `src/lib/brand-preferences.ts` for one-way migration; do not rename generated authentication storage, so sessions and notification deduplication remain intact.
