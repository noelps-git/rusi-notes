# rusi-notes

An iOS Shortcuts automation that logs a voice note after every Strava run — transcribed by iOS, cleaned up by Claude AI, and saved directly to your Strava activity description.

---

## What It Does

1. You finish a run on Strava
2. Open the iOS Shortcut
3. Speak your run note — in any language
4. iOS transcribes it natively
5. Claude (claude-sonnet-4-6) removes filler words (um, uh, like, you know...) while keeping your original tone and emotion intact
6. The cleaned note is saved as your Strava activity description automatically

---

## Setup

### What You Need

| Item | Where to get it |
|------|----------------|
| Strava Client ID + Secret | https://www.strava.com/settings/api (you already have this) |
| Strava Refresh Token | Follow `strava_oauth_helper.md` (one-time setup) |
| Anthropic API Key | https://console.anthropic.com |
| iPhone with iOS 16+ | For Shortcuts + Dictate Text action |

---

### Step 1 — Get Your Strava Refresh Token

Follow the guide in [`strava_oauth_helper.md`](./strava_oauth_helper.md). This is a one-time browser-based step to authorize your Strava app.

---

### Step 2 — Fill In Your Config

Copy `shortcut-config.json` and fill in your credentials. You'll reference these values when building the Shortcut in Step 3.

```json
{
  "strava_client_id": "YOUR_CLIENT_ID",
  "strava_client_secret": "YOUR_CLIENT_SECRET",
  "strava_refresh_token": "YOUR_REFRESH_TOKEN",
  "anthropic_api_key": "YOUR_ANTHROPIC_KEY",
  "claude_model": "claude-sonnet-4-6"
}
```

> **Security note:** These values will be stored as plain text inside the iOS Shortcut. Do not share your Shortcut file with others once configured.

---

### Step 3 — Build the iOS Shortcut

Follow [`shortcut-steps.md`](./shortcut-steps.md) to build the Shortcut action by action in the iOS Shortcuts app.

---

## How It Works (Technical Flow)

```
Open Shortcut
     ↓
Strava OAuth: POST /oauth/token → get access_token (refresh token flow)
     ↓
Strava API: GET /athlete/activities?per_page=1 → get latest activity ID
     ↓
iOS Dictate Text → raw transcript (any language)
     ↓
Anthropic API: POST /v1/messages → cleaned note (fillers removed, emotion preserved)
     ↓
Strava API: PUT /activities/{id} → save description
     ↓
iOS Notification: "Run note saved!"
```

---

## Roadmap

### Phase 2 — Photos & Videos
- Add a `Select Photos` step after the note is saved
- Upload photos to the Strava activity via `POST /activities/{id}/photos`
- Optional: record a short video and attach it

### Phase 3 — WhatsApp Sharing
- After saving to Strava, share your run summary + activity link to WhatsApp contacts
- Uses the WhatsApp URL scheme (`whatsapp://send?text=...`) — no extra app needed
- Future: WhatsApp Business API for sharing to groups

---

## Files in This Repo

| File | Purpose |
|------|---------|
| `README.md` | This setup guide |
| `shortcut-config.json` | Credential template (fill in your values) |
| `strava_oauth_helper.md` | One-time Strava OAuth setup guide |
| `shortcut-steps.md` | Full step-by-step Shortcut build guide |
