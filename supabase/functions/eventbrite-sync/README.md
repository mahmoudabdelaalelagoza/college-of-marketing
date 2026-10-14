# Eventbrite sync Edge Function

This function keeps the Eventbrite private token on the server side and syncs live Eventbrite events into the `events` table used by the public website.

## Required Supabase secrets

Set these before deploying the function:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set EVENTBRITE_TOKEN_SECRET=use-a-long-random-secret
```

`SUPABASE_URL` is provided automatically by Supabase Edge Functions. If your project does not provide it, set it as a secret too.

## Deploy

```bash
supabase functions deploy eventbrite-sync
```

After deployment, open Dashboard > Events > Eventbrite connection:

1. Paste the Eventbrite private API token.
2. Add the real Eventbrite organisation ID, not the email address.
3. Save settings.
4. Test saved connection.
5. Sync now.
