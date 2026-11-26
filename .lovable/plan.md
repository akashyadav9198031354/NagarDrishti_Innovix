# Citizen login and account controls

## What will change
- Add a bilingual citizen account page for email/password access; whether it includes self-registration follows the user's answer.
- Keep authority sign-in and its role gate separate.
- Show the signed-in user's name in the shared header, with a clear sign-out action; use the account's saved name and a safe email fallback.
- Keep complaint submission available as it is today; do not require login to report.

## Technical approach
- Reuse the existing browser auth client and add one shared client-side auth state provider for route and header consistency.
- Add a dedicated `/login` route and bilingual strings, using existing UI controls and semantic theme tokens.
- Preserve existing role assignment and authority-only dashboard checks; record the shared auth-state convention in `AGENTS.md`.
- Verify sign-in/out and name display in the preview, then check the build log.
