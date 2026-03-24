# Embedded Dashboard Editor — simple demo

Embeds Luzmo dashboards using the [Embedded Dashboard Editor](https://developer.luzmo.com/guide/dashboard-embedding--embedded-dashboard-editor.md) pattern: the backend issues a short-lived **Embed token** and the frontend passes the returned `id` and `token` to `<luzmo-embed-dashboard>`.

## Setup

### Luzmo API key, token, and Collection

1. In Luzmo, create a **Collection** and add the dashboards (and datasets) your users should reach.
2. Copy `.env.example` to `.env` and set:
   - `LUZMO_API_KEY` / `LUZMO_API_TOKEN` — from your Luzmo profile (API keys).
   - `LUZMO_COLLECTION_ID` — the Collection UUID from step 1.

For EU (default) you can omit `LUZMO_API_HOST`. For US tenants set `https://api.us.luzmo.com`.

### Run

1. `npm install`
2. `npm run start`
3. Open `http://localhost:3000`

For local development with auto-reload: `npm run dev`

### Links

- [Generating an authorization token](https://developer.luzmo.com/guide/dashboard-embedding--generating-an-authorization-token.md)
- [createAuthorization (embed)](https://developer.luzmo.com/api/createAuthorization.md)
