# Prompt Builder Web App Implementation Plan

## Goal Description
Build a premium, responsive web application that helps users generate high-quality AI prompts based on the "Context + Constraints + Examples" strategy. The app will feature a structured input flow, visual feedback, and AI-assisted improvements.

## Proposed Changes

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (for layout and utility) + Custom CSS (for premium effects like glassmorphism and animations)
- **Icons**: Lucide React
- **Language**: TypeScript

### Directory Structure
```
prompt-builder/
  ├── app/
  │   ├── layout.tsx       # Root layout with premium theme provider
  │   ├── page.tsx         # Main application view
  │   └── globals.css      # Global styles, variables, tailwind directives
  ├── components/
  │   ├── prompt-builder.tsx # Main container component
  │   ├── section-context.tsx
  │   ├── section-constraints.tsx
  │   ├── section-examples.tsx
  │   ├── generated-prompt.tsx
  │   └── ui/              # Reusable premium UI components (cards, buttons, inputs)
  ├── lib/
  │   └── utils.ts         # Helper functions
  ├── package.json
  ├── tsconfig.json
  ├── next.config.js
  ├── tailwind.config.ts
  └── postcss.config.js
```

### Components Detail

#### `package.json`
- Dependencies: `next`, `react`, `react-dom`, `lucide-react`, `clsx`, `tailwind-merge`

#### `app/globals.css`
- Define CSS variables for the premium dark color palette.
- Add utilities for glassmorphism, gradients, and micro-animations.

#### `components/prompt-builder.tsx`
- **State Management**: Manage the state of Context, Constraints, and Examples.

#### `components/section-context.tsx`
- Textarea with a "magic" button for "Make it specific".

#### `components/section-constraints.tsx`
- **Tech Stack Selector**: Preset options (Tailwind, Vanilla JS, React, Vue, Next.js).
- **Custom Constraints**: Add/Remove custom text constraints.

#### `components/section-examples.tsx`
- **File Upload Area**: Drag & drop zone style.

#### `components/generated-prompt.tsx`
- Showing the final assembled prompt with "Copy to Clipboard" button.

## Verification Plan
1. `npm install`
2. `npm run dev`
3. Verify layout and responsiveness.
4. Test structured prompt generation.
