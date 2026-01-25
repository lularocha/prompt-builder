# Product Roadmap & Feature Status

This document tracks the implementation status and future roadmap for the Prompt Builder application.

**Latest update**: Enhanced Agent Analysis to provide 4 context suggestions (up from 2), now including dedicated suggestions for visual style/look and feel and layout patterns.

---

## Current Implementation Status

### Completed (MVP)
- **Premium UI**: Glassmorphism design, dark theme, responsive layout
- **4-Section Prompt Strategy**: Context + Persona + Constraints & Tech + Examples
- **Prompt Generation**: Real-time assembly of inputs into formatted prompt
- **Copy & Download**: Export generated prompts as text
- **File Upload**: Drag & drop zone for reference files (images, PDFs, code)
- **Code Snippets**: Textarea for pasting example code
- **Tech Stack Selector**: Preset options and custom constraint badges
- **Basic "Make it Specific" (Context)**: Dictionary-based keyword enhancement
- **Agent Analysis (Vision API)**: AI-powered image analysis with Claude Sonnet Vision
  - Upload design screenshots or wireframes
  - Automatic extraction of visual patterns (layout, components, context)
  - Interactive suggestion checkboxes for Context, Persona, and Tech Stack
  - One-click population of corresponding card sections
  - Real-time analysis status badges (Idle → Analyzing → Complete)

### UI Placeholders (Not Functional)
These elements exist in the UI but have no backend implementation:

| Element | Location | Current Behavior |
|---------|----------|------------------|
| "Make it Specific" button | Persona section | Does nothing (mockup) |

---

## Why AI Features Require Backend Integration

> **Important**: The current app is fully functional as a static prompt builder. The features below require API integration with AI services, which means:

1. **API Key Security**: AI APIs (OpenAI, Gemini, etc.) require secret keys that cannot be exposed in client-side JavaScript. Anyone viewing browser dev tools could steal exposed keys.

2. **Server-Side Layer**: Next.js API routes (`app/api/*`) provide a secure way to call AI services while keeping keys hidden on the server.

3. **Cost**: AI API calls have usage costs that require an account with credits.

**Bottom Line**: The MVP works perfectly as a prompt-building tool. AI-powered enhancements are a future upgrade that requires backend setup and API credits.

---

## Future Features

### Feature 1: Persona Presets
**Status**: Not Started
**Complexity**: Low (no API required)

**Goal**: Quick-select common expert roles instead of writing from scratch.

**Implementation**:
1. Create `lib/personas.ts` with preset objects: `{ id, name, description, systemPrompt }`
2. Add a dropdown/combobox above the Persona textarea
3. Selecting a preset fills the textarea (user can still edit)

**Example Presets**: "Senior Frontend Architect", "Data Scientist", "DevOps Engineer", "Technical Writer"

---

### Feature 2: AI-Powered "Make it Specific"
**Status**: Partial (Context has dictionary fallback, Persona is mockup)
**Complexity**: Medium (requires API)

**Goal**: Use an LLM to intelligently refine vague user input.

**Implementation**:
1. Create `app/api/enhance/route.ts`
2. Integrate LLM SDK (OpenAI or Google Generative AI)
3. Prompt: "You are an expert PM. Rewrite this vague requirement to be specific, actionable, and technical: [User Input]"
4. Update frontend to call API with loading state

**Security**: API keys stored in `.env.local`, never exposed to client.

---

### Feature 3: Smart Constraints & Tech Suggestions
**Status**: Not Started
**Complexity**: Medium

**Goal**: Suggest technologies based on project context and persona.

**Implementation (Phased)**:
- **Phase 1 (Rules)**: Keyword mapping (e.g., "mobile" -> suggest React Native, Expo)
- **Phase 2 (AI)**: Send context to API that returns recommended stack as JSON

**UI**: "Recommended Stack" panel with one-click add buttons.

---

### Feature 4: Agent Analysis (Multimodal Vision) ✅ COMPLETED
**Status**: Fully Implemented
**Complexity**: High (Vision API)

**Goal**: Automatically analyze uploaded design screenshots/wireframes to extract visual context.

**What It Does**:
1. User uploads a design screenshot or wireframe (PNG, JPG, etc.)
2. Claude Sonnet Vision API analyzes the image
3. Extracts patterns: layout structure, component types, visual context
4. Returns AI-generated suggestions in three categories:
   - **Context** (4 suggestions):
     - 2 describing what is being built (e.g., "Dashboard with data cards")
     - 1 for visual style/look and feel (e.g., "Modern minimalist design", "Clean corporate aesthetic")
     - 1 for layout patterns (e.g., "Card-based grid layout", "Sidebar navigation")
   - **Persona**: Ideal developer profile (2 suggestions, e.g., "React developer with TypeScript experience")
   - **Tech Stack**: Recommended technologies (2-3 suggestions, e.g., "React", "Tailwind CSS")
5. Interactive checkboxes allow users to select which suggestions to add
6. Selected suggestions automatically populate corresponding card sections

**Technical Implementation**:
- Server-side API route: `app/api/analyze-image/route.ts`
- Uses `@anthropic-ai/sdk` with Claude Sonnet 4
- Client converts images to base64 and sends to API
- Structured JSON response matching `VisualContextSuggestions` interface
- Loading states: Idle → Analyzing → Complete
- Duplicate prevention when adding suggestions
- Environment variable: `ANTHROPIC_API_KEY` (secured in `.env.local` and Vercel)

**Cost**: ~$0.01-0.02 per image analysis

---

## Implementation Priority

For someone wanting to add remaining AI features, recommended order:

1. **Persona Presets** - No API needed, improves UX immediately
2. **AI "Make it Specific"** - Single API route, high value
3. **Smart Suggestions** - Can start with rule-based (no API)
4. ~~**Agent Analysis**~~ - ✅ **COMPLETED**

---

## Technical Notes

- **Framework**: Next.js 14+ with App Router
- **API Routes**: Use `app/api/` directory for server-side endpoints
- **AI Provider**: Anthropic (Claude Sonnet 4) for Vision API
- **Environment Variables**: Store keys in `.env.local` (gitignored) and Vercel
- **State Management**: React hooks in PromptBuilder component
- **Image Processing**: Client-side base64 conversion, server-side API calls
