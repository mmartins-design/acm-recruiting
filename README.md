# ACM Recruiting

Responsive Atlantic Coast Mortgage recruiting landing page, built around **More Production. More Time.**

## Development

Requires Node.js 20+. No packages, API keys, or dependency installation required.

```
npm run dev
npm run check
npm run build
```

Local development URL: http://127.0.0.1:4173. Production files build to `dist/`.

## Vercel

Import `mmartins-design/acm-recruiting`. Select framework **Other**, use `npm run build`, and output directory `dist`. No environment variables required. `vercel.json` supplies these settings.

## Editing

- Copy and section structure: `public/index.html`
- Brand tokens, responsive layout, and Gotham fonts: `public/styles.css`
- Navigation, video player, story filters, and contact events: `public/app.js`
- Assets: `public/assets/`

Contact buttons route directly to Heather Mitchell at 571.277.2120 and hmitchell@acmllc.com, as listed in the supplied recruiting brochure. No form submission or email service is involved.

## Content and launch notes

This first version is intentionally excluded from search indexing with both a robots meta tag and `X-Robots-Tag`. Remove both after the content review and final launch decision.

The page uses supplied ACM imagery and original testimonial recordings. Card headlines are editorial descriptions, not purported verbatim quotes. Confirm permission for public recruiting use and review video captions before an advertised launch. Confirm web embedding rights for the supplied Gotham fonts. Keep site-specific font files with this project; do not redistribute them as a standalone font pack.

Current program availability, branch models, and contact ownership should be reviewed by ACM. The briefs identify the copy as working creative content. This version excludes unverified production figures, geographic claims, performance calculators, projected outcomes, and unapproved testimonial quotes. The required Built Here / Grew Here / Moved Here candidate stories can replace the current supplied videos once their final assets are available.

The Mortgage Experience Platform graphic is explicitly an illustrative workflow. Program resources are described without numeric counts or promised access. The transition section describes an intended experience, not a guaranteed first-year schedule.

The internal strategy documents and brand guide are not included in the deployment or repository.

## Measurement

The page emits `acm:contact` CustomEvents with the clicked method (`text`, `call`, `email`) and current URL campaign parameters. No analytics vendor, remote tracking, or persistent visitor storage is enabled. Connect an approved provider to record those events. Recruiting owns conversation and discovery-meeting outcomes; a CTA click does not prove a conversation occurred.

## Sources

- Supplied October 13, 2026 creative brief and copy/implementation guide
- ACM Brand Guidelines 2025
- Supplied Heather Mitchell recruiting brochure (contact details and support descriptions)
- Supplied Sam Hrehocik team photograph, cropped above embedded social text
- Supplied Lauren Walton, Jordan Abdel-Haq, and Steve Hendriksen testimonial recordings and thumbnails
- ACM corporate website for current product, company, NMLS, and legal links
