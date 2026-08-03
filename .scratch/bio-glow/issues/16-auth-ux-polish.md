# Auth UX polish

Type: task
Status: resolved

## Question

`Auth.tsx` (shared by `/login` and `/signup`) is unstyled TanStack Start starter-template scaffolding: it renders a `fixed inset-0` full-screen overlay that hides the parent route's own hero heading behind it, uses light-mode-first styling (`bg-white dark:bg-gray-900`) completely disconnected from the app's dark abyss system, labels the email field "Username," and styles the button with a generic `cyan-600`/`font-black uppercase` treatment matching nothing else in the app. Fix it to match the established visual language (Fraunces/Inter/IBM Plex Mono, dark specimen-card system) used everywhere else since tickets 10–14.

## Answer

Not a design-direction question — the target look was already established by every other page (10–14), so this was a direct fix rather than a multi-variant prototype:

- `Auth.tsx`: dropped the `fixed inset-0` overlay entirely (it was hiding the parent route's heading); rebuilt as a plain card (`bg-white/5 border border-white/10 rounded-lg`) matching the input/button styling used in `SpeciesForm`/`SightingForm`. Relabeled the email field ("Username" → "Email" — it's a `type="email"` input) and added `required`/`autoComplete` attributes.
- `login.tsx`/`signup.tsx`: heading switched to `font-display` (was default sans, inconsistent with every other page); subtitle copy replaced with concrete descriptions of what signing in/up actually does ("Sign in to log a sighting or manage your entries" / "Create an account to add species and log sightings") instead of generic "bioluminescent journey/adventure" marketing language, matching ticket 12's home-page rewrite philosophy.
- Fixed a related bug found while touching this code: the "Sign up here"/"Sign in here" links used a plain `<a href>` (`motion.a`), causing a full page reload instead of client-side navigation — every other internal link in the app uses TanStack's `Link`. Switched both to `Link`.
