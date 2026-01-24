# Prompt Builder

A tool for creating high-quality AI prompts using a structured 4-section strategy: Context + Persona + Constraints & Tech + Examples.

## Features

- **4-Section Strategy**: Structured approach to prompt creation
- **Real-time Assembly**: See your prompt build as you type
- **Copy & Download**: Export prompts as text
- **File Upload**: Drag & drop reference files (images, PDFs, code)
- **Tech Stack Selector**: Preset options and custom constraint badges
- **Basic Enhancement**: Dictionary-based keyword improvement for context
- **Premium UI**: Glassmorphism design with dark theme
- **Responsive**: Works on desktop and mobile

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | App Router framework |
| **React 18** | Component-based UI |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Lucide React** | Icon library |

## Project Structure

```
prompt-builder/
├── app/
│   ├── page.tsx            # Main page with PromptBuilder
│   ├── layout.tsx          # Root layout, dark theme
│   └── globals.css         # CSS variables, glassmorphism
├── components/
│   ├── prompt-builder.tsx  # Main state container
│   ├── generated-prompt.tsx
│   ├── section-context.tsx
│   ├── section-persona.tsx
│   ├── section-constraints.tsx
│   ├── section-examples.tsx
│   └── ui/                 # Reusable UI components
├── lib/
│   └── utils.ts            # cn() helper for class merging
├── backlog/                # Product roadmap & documentation
└── public/                 # Static assets
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Status

**MVP Complete** - The app works as a static prompt builder. AI-powered features (marked in UI) are designed but require backend API integration.

See `backlog/product_roadmap.md` for future feature plans.
