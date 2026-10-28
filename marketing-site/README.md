# Wave Transakt public website

The marketing website for Wave Transakt, Wavebiz and Wave POS, deployed as a Render static site. This website has no account login, OTP requirement or live financial processing.

## Source and hosting

The source is saved in `Mams62/wavebiz-pwa`, in the separate `website/wavetransakt-20261028` branch. The website lives in `marketing-site/`; other branches and the existing Wavebiz work are preserved.

Render settings:

- Type: Static Site
- Branch: `website/wavetransakt-20261028`
- Build command: `node marketing-site/build.mjs`
- Publish directory: `marketing-site/dist`
- Environment: `SKIP_INSTALL_DEPS=true`
- Automatic deployment: enabled

The build uses Render's own `RENDER_EXTERNAL_URL` to populate the canonical URL, Open Graph sharing metadata, robots file and sitemap. Set `SITE_URL` to override this when connecting a custom domain later.

The build has no dependency installation step. Static hosting uses Render's free tier and its workspace's included bandwidth and pipeline minutes. No domain registration or paid service is part of this setup.

## Editing

Edit the files in `src/`. `index.html` contains page content and sections. `styles.css` contains the responsive design. `app.js` powers the product tabs, concept walkthrough, mobile navigation, FAQs and privacy dialog.

`src/site-config.js` accepts `demoVideoUrl`: use a full YouTube URL or an MP4 path such as `assets/wave-explainer.mp4`. An empty value keeps the five-step interactive concept walkthrough.

To verify a local build, set `SITE_URL` to the local preview origin and run `node marketing-site/build.mjs` from the repository root.


## Brand, sample wallet and information pages

The logo mark is preserved from the Wave Transakt Android vector asset; see `BRAND.md` for the original repository path and Git blob. The customer phone illustration uses the user-requested sample profile Chinedu Musa Ade and a ₦6,300.00 illustrative balance. Its QR is a concept pattern, not a live payment destination.

The site includes original company, trust and safety content and dedicated `privacy.html`, `terms.html`, `regulatory.html` and `support.html` pages. These describe the informational website and development status, not a licensed or live financial service. They do not claim CBN licensing, NDIC deposit insurance, PCI certification, guaranteed transaction performance, real customers or financial traction.

The content structure was informed by a review of OPay's public homepage, without reproducing its promotional copy, brand assets, certification claims or service promises. Official reference links cover the CBN payment-service provider directory and complaint guidance, and the Nigeria Data Protection Commission.

Review the privacy and service terms whenever actual data collection, providers or live product availability change.
