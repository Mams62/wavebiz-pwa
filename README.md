# WaveBiz PWA

Installable mobile web client for WaveBiz, designed for iPhone, iPad, Android and desktop browsers.

## Included now

- business onboarding;
- live dashboard totals;
- product and stock entry;
- sale recording with Cash, Transfer, POS or Credit;
- automatic stock deduction through the API;
- installable web-app manifest;
- iOS safe-area and home-screen support;
- offline app-shell caching.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `VITE_API_BASE_URL` to the running WaveBiz API address. Production deployments must use HTTPS.

## Verification

```bash
npm run build
```

Offline transaction queuing, authentication and conflict-safe synchronization are future milestones; the current service worker caches the interface only.
