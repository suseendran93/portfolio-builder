---
name: buildfolio-feature-development
description: Use when adding or updating BuildFolio features so new UI, data flows, and docs stay consistent with the existing product theme, builder patterns, and launch standards.
---

# BuildFolio Feature Development

## Use This Skill When

- Adding a new product feature or workflow
- Creating new builder panels, modals, onboarding, or public-facing UI
- Changing persisted portfolio data
- Updating routes, publishing behavior, or deploy-facing behavior

## Styling Rules

- Keep the BuildFolio visual language intact.
- Reuse tokens from `src/styles/_tokens.scss` for color, spacing, radius, shadow, and motion.
- Prefer the existing surface system:
  - page background: soft slate
  - panels/cards: white or soft slate surfaces
  - primary accent: indigo brand family
- Do not introduce a new font stack.
- Match existing component shape language:
  - rounded-xl panels
  - rounded-lg/xl buttons and controls
  - soft borders
  - moderate shadows, not heavy glassmorphism or neon styling
- For new builder UI, align with patterns already used in:
  - `src/components/Builder/Builder.scss`
  - `src/components/Builder/Customizer.scss`
  - `src/components/Login/Login.scss`

## Product Rules

- Default to helping students and freshers move faster, not to adding more configuration.
- Prefer starter flows, presets, and guided choices over blank states.
- New onboarding or template features should reduce time-to-preview.
- Avoid adding features that make the builder feel more complex without improving first-run success.

## Data Rules

- Normalize persisted data in a utility file rather than relying on raw component state.
- Keep saved shapes small and explicit.
- Sanitize any user-provided public URL before render or save.
- If a new field affects rendering, make sure both preview and public view handle it.

## Implementation Rules

- Preserve mobile behavior.
- Reuse existing BEM naming in the area you are editing.
- Keep new copy concise and product-focused.
- If a feature changes route behavior, publishing, data shape, or setup steps, update the relevant docs.

## Validation

- Run focused tests for the changed utility/component behavior.
- Run the full test suite when the feature affects shared flows.
- Run a production build before closing the task.
