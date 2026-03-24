# Embedded Dashboard Editor — simple webapp

This demo embeds Luzmo dashboards using the [Embedded Dashboard Editor](https://developer.luzmo.com/guide/dashboard-embedding--embedded-dashboard-editor.md) pattern: the backend issues a short-lived **Embed token** and the frontend passes the returned `id` and `token` to `@luzmo/embed`.

SSO tokens and **Integration**-based setup are deprecated ([migrate to Embed tokens](https://academy.luzmo.com/article/wkr8t6j6)). This app uses **`type: 'embed'`** with **`access.collections`** so you grant access via a [Collection](https://developer.luzmo.com/api/createAuthorization.md) instead of an integration.

## Instructions to run

### Luzmo API key, token, and Collection

1. In Luzmo, create a **Collection** and add the dashboards (and datasets) your users should reach. Note the Collection’s id.
2. Copy `.env.example` to `.env` and set:
   - `LUZMO_API_KEY` / `LUZMO_API_TOKEN` — from your Luzmo profile (API keys).
   - `LUZMO_COLLECTION_ID` — the Collection uuid from step 1.

For EU (default) you can omit `LUZMO_API_HOST`. For US tenants use `https://api.us.luzmo.com` (and the matching app host on the frontend if you customize tenancy).

Legacy env names `CUMULIO_API_KEY` and `CUMULIO_API_TOKEN` are still read as fallbacks if `LUZMO_*` are unset.

### Run

1. `npm install`
2. `npm run start` — compiles TypeScript (server + browser bundle) then runs the server
3. Open `http://localhost:3000`

For local development with auto-reload of the server and client bundle: `npm run dev`

### More help

- [Request an embed token in your backend](https://developer.luzmo.com/guide/dashboard-embedding--generating-an-authorization-token.md)
- [Migrate from Temporary / SSO token to Embed token](https://academy.luzmo.com/article/wkr8t6j6)
- [createAuthorization (embed)](https://developer.luzmo.com/api/createAuthorization.md)
