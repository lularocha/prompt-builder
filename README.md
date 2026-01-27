# Prompt Builder

A tool for creating high-quality AI prompts using a structured 2-part strategy: System Prompt (Persona + Constraints) + User Prompt (Task + Requirements + Tech + Examples).

## Features

- **Structured 2-Part Prompt**: Organized into System Prompt and User Prompt sections
- **Project Naming**: Add custom project titles that are included in exports
- **Numbered Output**: Generated prompts automatically numbered for clarity
- **Real-time Assembly**: See your prompt build as you type
- **Copy & Download**: Export prompts as markdown with project title
- **File Upload**: Drag & drop reference files (images, PDFs, code)
- **AI Agent Analysis**: Claude Vision API analyzes uploaded images and generates contextual suggestions:
  - 2 persona suggestions for ideal developer profile
  - 3 constraint suggestions for quality standards
  - 2 task suggestions describing what's being built
  - 5 requirements suggestions (features, visual style, layout, interactions)
  - 3 tech stack recommendations
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
│   ├── api/
│   │   └── analyze-image/  # Vision API endpoint
│   ├── page.tsx            # Main page with PromptBuilder
│   ├── layout.tsx          # Root layout, dark theme
│   └── globals.css         # CSS variables, glassmorphism
├── components/
│   ├── prompt-builder.tsx       # Main state container & API integration
│   ├── generated-prompt.tsx     # Output display with project title
│   ├── section-system-prompt.tsx
│   ├── section-user-prompt.tsx
│   ├── section-examples.tsx     # File upload & Agent Analysis UI
│   └── ui/                      # Reusable UI components
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

Open the localhost URL shown in your terminal.

## Status

**MVP Complete with AI Integration** - The app is fully functional with Claude Vision API integration for image analysis. The Agent Analysis feature uses real AI to extract design patterns and generate contextual suggestions.

See `backlog/product_roadmap.md` for future feature plans.
