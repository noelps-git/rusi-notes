# Strava OAuth Setup (One-Time)

You only need to do this once. This gets you a `refresh_token` that the Shortcut uses every time it runs.

---

## What You'll Need
- Your Strava **Client ID** and **Client Secret** from https://www.strava.com/settings/api
- A browser on desktop or mobile
- Terminal (or any tool that can make a POST request — curl, Postman, etc.)

---

## Step 1 — Configure Your Strava API App

1. Go to https://www.strava.com/settings/api
2. If you haven't created an app yet, create one (name and description can be anything)
3. Set the **Authorization Callback Domain** to `localhost`
4. Note down your **Client ID** and **Client Secret**

---

## Step 2 — Authorize in Browser

Paste this URL into your browser, replacing `YOUR_CLIENT_ID` with your actual Client ID:

```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost&scope=activity:write,activity:read_all&approval_prompt=force
```

1. Log in to Strava if prompted
2. Click **Authorize**
3. Your browser will redirect to a URL like:
   ```
   http://localhost/?state=&code=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX&scope=read,activity:write,activity:read_all
   ```
4. Copy the value after `code=` — everything between `code=` and `&scope`

> The page will show an error ("This site can't be reached") — that's fine. You just need the `code` from the URL.

---

## Step 3 — Exchange Code for Refresh Token

Run this in your terminal, replacing the placeholders:

```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=THE_CODE_FROM_STEP_2 \
  -d grant_type=authorization_code
```

You'll get a JSON response like:

```json
{
  "token_type": "Bearer",
  "expires_at": 1234567890,
  "expires_in": 21600,
  "refresh_token": "fc569946288c1be9dd8ea1b77f6f0bf938432b15",
  "access_token": "a4b945687g...",
  "athlete": { ... }
}
```

5. Copy the `refresh_token` value — this is what you need

---

## Step 4 — Save to Your Config

Open `shortcut-config.json` and paste the refresh token:

```json
{
  "strava_refresh_token": "fc569946288c1be9dd8ea1b77f6f0bf938432b15"
}
```

And then enter this value in the Shortcut itself (see `shortcut-steps.md`, Step 1).

---

## Notes

- The `refresh_token` does **not** expire unless you revoke access or change your Strava password
- The `access_token` expires every 6 hours — the Shortcut handles this automatically by refreshing it each run
- The `code` from Step 2 can only be used **once** — if you miss it, repeat Step 2 to get a new one
- Required scopes: `activity:write` (to update descriptions) + `activity:read_all` (to read your latest activity)
