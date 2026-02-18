---
description: how to integrate BASIC and PREMIUM tiers with Stripe
---

# Subscription System Workflow

This workflow guides you through implementing tiered access (BASIC/PREMIUM) and Stripe payment integration.

## 1. User Tier Setup (Firestore)

Update the user profile in Firestore to track their subscription status.

- [ ] Create/Update `/users/{uid}` document with `{ tier: 'BASIC' }` upon initial signup.
- [ ] Update `AuthContext.js` to fetch this `tier` and make it globally available.

## 2. Feature Gating Logic

Restrict premium features based on the user's tier.

- [ ] **Publishing**: 
  - In `Builder.js`, check `userTier`.
  - Disable the 'Publish' button if `tier === 'BASIC'`.
  - Redirect users to an Upgrade page if they attempt to publish.
- [ ] **Resume Watermark**:
  - In `PortfolioView.js`, pass `showWatermark={userTier === 'BASIC'}` to the `ResumeDownload` component.

## 3. Stripe Integration

Implement the payment flow.

- [ ] **Frontend**:
  - Install `@stripe/stripe-js` and `@stripe/react-stripe-js`.
  - Create a `Pricing` component with a "Go Premium" button.
  - Implement a Stripe Checkout redirect.
- [ ] **Backend (Success Flow)**:
  - Create a `PaymentSuccess` page.
  - Upon landing, verify the session (or rely on a secure Firestore update if using webhooks).
  - Update `/users/{uid}/tier` to `'PREMIUM'`.

## 4. Verification

// turbo-all
- [ ] Navigate to the Builder as a Basic user and verify 'Publish' is locked.
- [ ] Download the resume and verify the 'DRAFT' watermark is present.
- [ ] Simulate a successful payment.
- [ ] Verify the 'Publish' button is unlocked and the watermark is removed from the resume.
