# iOS Shortcut — Step-by-Step Build Guide

Build this Shortcut in the iOS **Shortcuts** app. Each numbered item below is one action to add.

Open Shortcuts → tap **+** (new shortcut) → tap **Add Action** for each step below.

---

## Before You Start

Have your `shortcut-config.json` values ready:
- `strava_client_id`
- `strava_client_secret`
- `strava_refresh_token`
- `anthropic_api_key`

---

## SECTION 1 — Store Your Credentials

These steps store your API keys as variables inside the Shortcut.

### Action 1 — Store Anthropic API Key
- Add action: **Text**
- Type your Anthropic API key directly into the text field: `sk-ant-...`
- Add action: **Set Variable**
  - Variable name: `anthropicKey`

### Action 2 — Store Strava Client ID
- Add action: **Text**
- Type your Strava Client ID (numbers only, e.g. `12345`)
- Add action: **Set Variable**
  - Variable name: `stravaClientId`

### Action 3 — Store Strava Client Secret
- Add action: **Text**
- Type your Strava Client Secret
- Add action: **Set Variable**
  - Variable name: `stravaClientSecret`

### Action 4 — Store Strava Refresh Token
- Add action: **Text**
- Type your Strava Refresh Token (from `strava_oauth_helper.md`)
- Add action: **Set Variable**
  - Variable name: `stravaRefreshToken`

---

## SECTION 2 — Get a Fresh Strava Access Token

Strava access tokens expire every 6 hours. This step exchanges your refresh token for a fresh one.

### Action 5 — Refresh Token API Call
- Add action: **Get Contents of URL**
  - URL: `https://www.strava.com/oauth/token`
  - Method: **POST**
  - Request Body: **Form**
  - Add fields:
    | Key | Value |
    |-----|-------|
    | `client_id` | Variable: `stravaClientId` |
    | `client_secret` | Variable: `stravaClientSecret` |
    | `refresh_token` | Variable: `stravaRefreshToken` |
    | `grant_type` | Text: `refresh_token` |

### Action 6 — Extract Access Token
- Add action: **Get Dictionary Value**
  - Dictionary: result of Action 5
  - Key: `access_token`
- Add action: **Set Variable**
  - Variable name: `stravaToken`

---

## SECTION 3 — Get Your Latest Strava Activity

### Action 7 — Fetch Latest Activity
- Add action: **Get Contents of URL**
  - URL: `https://www.strava.com/api/v3/athlete/activities?per_page=1`
  - Method: **GET**
  - Headers: Add one header
    | Key | Value |
    |-----|-------|
    | `Authorization` | `Bearer ` + Variable: `stravaToken` |

    > To combine text + variable: tap the header value field, type `Bearer ` (with a space), then tap the variable picker and select `stravaToken`

### Action 8 — Get First Item
- Add action: **Get Item from List**
  - List: result of Action 7
  - Item: **First Item**

### Action 9 — Save Activity ID
- Add action: **Get Dictionary Value**
  - Dictionary: result of Action 8
  - Key: `id`
- Add action: **Set Variable**
  - Variable name: `activityId`

### Action 10 — Save Activity Name
- Add action: **Get Dictionary Value**
  - Dictionary: result of Action 8
  - Key: `name`
- Add action: **Set Variable**
  - Variable name: `activityName`

---

## SECTION 4 — Record Your Voice Note

### Action 11 — Dictate Text
- Add action: **Dictate Text**
  - Language: **Automatic** (detects your language)
  - Prompt: `Tell me about your run...` (optional, shown on screen)
  - Stops: **After Pause** (auto-stops when you stop speaking for ~1 second)
- Add action: **Set Variable**
  - Variable name: `rawTranscript`

---

## SECTION 5 — Clean Up with Claude

### Action 12 — Build the Claude Request Body
- Add action: **Dictionary**
  - Add key `model` → Text: `claude-sonnet-4-6`
  - Add key `max_tokens` → Number: `1024`
  - Add key `messages` → Array, with one Dictionary item:
    - Key `role` → Text: `user`
    - Key `content` → Text (tap to expand and combine):
      ```
      Clean up this Strava run note. Remove filler words (um, uh, like, you know, ah, oh, erm, basically, literally, so, right, okay). Do NOT change the meaning, emotion, tone, or personal style. Keep it in the same language it was written in. Keep it conversational and authentic — do not make it sound formal or polished. Just return the cleaned text, nothing else.

      [rawTranscript variable]
      ```
      > To insert the variable: after typing the prompt text, tap the variable picker and select `rawTranscript`
- Add action: **Set Variable**
  - Variable name: `claudeRequestBody`

### Action 13 — Call Claude API
- Add action: **Get Contents of URL**
  - URL: `https://api.anthropic.com/v1/messages`
  - Method: **POST**
  - Headers: Add three headers:
    | Key | Value |
    |-----|-------|
    | `x-api-key` | Variable: `anthropicKey` |
    | `anthropic-version` | `2023-06-01` |
    | `content-type` | `application/json` |
  - Request Body: **JSON**
  - JSON Body: Variable `claudeRequestBody`

### Action 14 — Extract Cleaned Note
- Add action: **Get Dictionary Value**
  - Dictionary: result of Action 13
  - Key: `content`
- Add action: **Get Item from List**
  - List: result of above
  - Item: **First Item**
- Add action: **Get Dictionary Value**
  - Dictionary: result of above
  - Key: `text`
- Add action: **Set Variable**
  - Variable name: `cleanedNote`

---

## SECTION 6 — Save to Strava

### Action 15 — Update Activity Description
- Add action: **Dictionary**
  - Add key `description` → Variable: `cleanedNote`
- Add action: **Get Contents of URL**
  - URL: `https://www.strava.com/api/v3/activities/` + Variable: `activityId`
    > Combine: type the base URL, then tap variable picker for `activityId`
  - Method: **PUT**
  - Headers: Add one header:
    | Key | Value |
    |-----|-------|
    | `Authorization` | `Bearer ` + Variable: `stravaToken` |
  - Request Body: **JSON**
  - JSON Body: the Dictionary from this step

---

## SECTION 7 — Confirm Success

### Action 16 — Show Notification
- Add action: **Show Notification**
  - Title: `Run note saved!`
  - Body: Variable `activityName` + ` — updated on Strava`
    > Combine: tap variable picker for `activityName`, then type the rest

---

## Final Steps

1. Tap the shortcut name at the top and rename it to something like **"Log Run Note"**
2. Tap **Done** to save
3. Add it to your Home Screen: tap the share icon → **Add to Home Screen**

---

## Testing

Before using it after a real run:
1. Run the shortcut
2. Speak something with lots of fillers: *"So um I went for a run today and like it was uh really hard but you know I pushed through"*
3. Check your latest Strava activity — the description should be updated with the cleaned version
4. If something fails, add a **Show Result** action after any step to inspect the output

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "Unauthorized" from Strava | Check your Client ID, Secret, and Refresh Token are correct |
| Empty description on Strava | Check `activityId` is being extracted correctly (add Show Result after Action 9) |
| Claude returns an error | Verify your Anthropic API key and that `content-type: application/json` header is set |
| Voice note is empty | Tap the microphone and speak clearly before pausing; make sure microphone permission is granted to Shortcuts |
| Wrong activity updated | The Shortcut always updates your most recent Strava activity — run it right after finishing a run |
