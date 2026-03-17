# BuildFolio

BuildFolio is a React app for creating a personal portfolio site and downloadable resume from a single set of content. Users can sign up, fill out their profile, preview the portfolio, export a PDF resume, and publish a public share link.

## What It Does

- Email/password authentication with Firebase Auth
- Guided portfolio builder with sections for:
  - Profile
  - Education
  - Work experience
  - Skills
  - Contact
- Portfolio styling controls:
  - Layouts: `modern`, `classic`, `creative`
  - Themes: `light`, `dark`, `royal`
  - Accent color
- Resume styling controls:
  - Layouts: `standard`, `executive`, `minimal`
  - Accent color
- Logged-in preview flow
- Public portfolio publishing via slug-based URL
- PDF resume export with `html2pdf.js`

## Tech Stack

- React 18
- React Router DOM 6
- Firebase Auth
- Firestore
- Tailwind CSS
- Sass
- React Hot Toast
- html2pdf.js
- GitHub Pages deployment

## Current Product Caveat

The premium upgrade flow is still intentionally fake at this stage.

- The UI simulates a successful upgrade
- It is not backed by a real Stripe checkout or webhook flow
- Do not treat premium access as secure billing logic yet

Everything else in this README describes the current app behavior as implemented.

## Project Structure

Key paths:

- [src/App/App.js](/Users/ssndrn/Web-dev/portfolio-builder/src/App/App.js): routing
- [src/context/AuthContext.js](/Users/ssndrn/Web-dev/portfolio-builder/src/context/AuthContext.js): auth state and user doc sync
- [src/context/PortfolioContext.js](/Users/ssndrn/Web-dev/portfolio-builder/src/context/PortfolioContext.js): portfolio state loading and normalization
- [src/components/Builder/Builder.js](/Users/ssndrn/Web-dev/portfolio-builder/src/components/Builder/Builder.js): main editor
- [src/components/Builder/Customizer.js](/Users/ssndrn/Web-dev/portfolio-builder/src/components/Builder/Customizer.js): styling tab
- [src/pages/PortfolioView/PortfolioView.js](/Users/ssndrn/Web-dev/portfolio-builder/src/pages/PortfolioView/PortfolioView.js): logged-in preview
- [src/pages/PublicPortfolioView/PublicPortfolioView.js](/Users/ssndrn/Web-dev/portfolio-builder/src/pages/PublicPortfolioView/PublicPortfolioView.js): public share route
- [src/components/ResumeDownload/ResumeDownload.js](/Users/ssndrn/Web-dev/portfolio-builder/src/components/ResumeDownload/ResumeDownload.js): PDF resume generation
- [src/utils/portfolioStorage.js](/Users/ssndrn/Web-dev/portfolio-builder/src/utils/portfolioStorage.js): Firestore persistence
- [src/utils/customization.js](/Users/ssndrn/Web-dev/portfolio-builder/src/utils/customization.js): normalization and customization defaults
- [src/utils/contact.js](/Users/ssndrn/Web-dev/portfolio-builder/src/utils/contact.js): contact URL sanitization

## Routes

The app now uses browser-style routes with GitHub Pages SPA fallback handling.

- `/` -> login
- `/signup` -> signup
- `/builder` -> private builder
- `/preview` -> private preview
- `/p/:slug` -> public portfolio
- `/success` -> payment success screen
- `/cancel` -> payment cancelled screen

Public portfolio links are generated in this shape:

- `https://<host>/p/<slug>`

## Data Model

Firestore collections:

- `users/{uid}`
- `portfolios/{uid}`

Typical portfolio document shape:

```json
{
  "name": "Jane Doe",
  "title": "Frontend Engineer",
  "about": "Short summary",
  "profilePic": "data:image/jpeg;base64,...",
  "education": [],
  "work": [],
  "skills": [
    { "name": "React" }
  ],
  "contact": {
    "phone": "+1 555 0100",
    "email": "jane@example.com",
    "linkedin": "https://linkedin.com/in/jane",
    "github": "https://github.com/jane"
  },
  "customization": {
    "portfolio": {
      "layout": "modern",
      "theme": "light",
      "accentColor": "#4f46e5"
    },
    "resume": {
      "layout": "standard",
      "accentColor": "#1e293b"
    }
  },
  "customSlug": "jane-doe-1234",
  "published": true,
  "publishedAt": "2026-03-18T10:00:00.000Z"
}
```

Notes:

- Skills no longer store proficiency
- LinkedIn/GitHub URLs are sanitized to `https://` values
- Profile photos are compressed before saving, but they are still stored in Firestore as data URLs

## Environment Variables

Create a `.env.local` file in the project root:

```bash
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
```

These values are read in [src/firebase.js](/Users/ssndrn/Web-dev/portfolio-builder/src/firebase.js).

## Local Development

Requirements:

- Node `16.14.0` is the version declared in `package.json`
- npm
- A Firebase project with Auth and Firestore enabled

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm start
```

Run tests:

```bash
npm test
```

Run the full suite once in CI mode:

```bash
CI=true npm test -- --watchAll=false --runInBand
```

Create a production build:

```bash
npm run build
```

## Firebase Setup

Minimum Firebase setup:

1. Create a Firebase project.
2. Enable Email/Password authentication.
3. Create a Firestore database.
4. Add a web app and copy the Firebase config into `.env.local`.
5. Deploy Firestore rules from [firestore.rules](/Users/ssndrn/Web-dev/portfolio-builder/firestore.rules).

The app currently uses:

- Firebase Auth for signup/login/logout
- Firestore for user metadata and portfolio storage

## Deployment

This repo is configured for GitHub Pages.

Relevant config:

- `homepage` in [package.json](/Users/ssndrn/Web-dev/portfolio-builder/package.json)
- `predeploy` and `deploy` scripts in [package.json](/Users/ssndrn/Web-dev/portfolio-builder/package.json)

Deploy:

```bash
npm run deploy
```

That builds the app and publishes the `build/` directory through `gh-pages`.

## Validation and Safety Behavior

Current validation rules include:

- Name, title, about, email, phone, profile image required
- At least one education item
- At least one work item
- At least one skill
- LinkedIn/GitHub fields must be valid `https://` URLs if provided

Hardening already added:

- Public contact links reject unsafe URL schemes
- Unknown routes show a real 404 page
- Uploaded profile images are resized/compressed before save
- Styling options are normalized so unsupported saved combinations do not break rendering

## Known Limitations

- Premium/payment flow is intentionally fake for now
- Profile images are still stored in Firestore instead of object storage
- No end-to-end test coverage yet
- README assumes GitHub Pages deployment; Firebase Hosting is not configured in this repo

## Recommended Next Steps

- Replace the fake premium flow with real Stripe checkout plus webhook-backed entitlement updates
- Move profile images from Firestore to Firebase Storage
- Add end-to-end coverage for signup, publish, preview, and resume download
- Add a production `.env` and deployment checklist outside the repo

## Scripts

Available npm scripts:

```bash
npm start
npm test
npm run build
npm run predeploy
npm run deploy
```
