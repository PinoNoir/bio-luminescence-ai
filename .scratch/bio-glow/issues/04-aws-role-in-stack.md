# AWS's role in the stack

Type: grilling
Status: resolved

## Question

What's AWS actually for here, on top of Supabase (which already covers Postgres, Auth, Storage, and Realtime)?

## Answer

Supabase owns the entire backend: database, auth, photo storage, realtime. AWS's only job is hosting the static frontend build (candidates: S3 + CloudFront, or Amplify — which specific service is still open, see ticket 08).
