# Access model

Type: grilling
Status: resolved

## Question

Who can create/edit data, and can anyone browse without an account?

## Answer

Public browsing of Species and Sightings requires no account (matches the existing Explore/Learn-style public pages). Signing in as a scientist enables creating Species and Sightings. No moderation/verification queue — an authenticated scientist's writes are live immediately.

**Amended while resolving ticket 06**: ownership isn't uniform across the two entities. Species are a shared taxonomy catalog — any authenticated scientist can edit any entry (like a wiki/taxon page), though delete stays creator-only to guard against casual data loss. Sightings are inherently personal ("who saw this, where") and stay strictly owner-scoped for both edit and delete. See ticket 06 for the RLS policies implementing this.
