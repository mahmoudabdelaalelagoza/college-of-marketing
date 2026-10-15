# Eventbrite sync Edge Function

This function keeps the Eventbrite private token on the server side and syncs live Eventbrite events into the `events` table used by the public website.

## Required Supabase secrets

Set the encryption secret before deploying the function:

```bash
supabase secrets set EVENTBRITE_TOKEN_SECRET=use-a-long-random-secret
```

Supabase provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to deployed Edge Functions automatically. Keep the same encryption secret across deployments so saved tokens remain readable.

## Deploy

```bash
supabase functions deploy eventbrite-sync
```

After deployment, open Dashboard > Events > Eventbrite connection:

1. Paste the Eventbrite private API token and save settings.
2. If the token can access several organisations, select one by name and save again. A single organisation is selected automatically.
3. Test the saved connection.
4. Sync now.
