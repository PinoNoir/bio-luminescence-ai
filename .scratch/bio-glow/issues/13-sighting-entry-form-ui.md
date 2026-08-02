# Sighting entry form UI

Type: prototype
Status: claimed

## Question

Species has a full CRUD form (ticket 11); Sightings only render mock data — there's no way to actually log one yet, even though "log field Sightings" is half the app's stated destination. What does the Sighting entry form look like and how does it behave — picking an existing Species (not importing a new one; a Sighting always references a cataloged Species), capturing location (lat/lng, ticket 06 kept this plain rather than PostGIS — is a browser-geolocation "use my location" button worth it for a field-data tool?), depth, date, notes, and photos (ticket 07: up to 6, 5MB, JPEG/PNG/WebP)? Build a rough concrete prototype to react to. Photo upload and save stay stubs, same reasoning as ticket 11 — no live Supabase table or Storage bucket yet.
