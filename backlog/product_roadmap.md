# Product Roadmap & Feature Status

This document tracks the implementation status and future roadmap for the Prompt Builder application.

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

### UI Placeholders (Not Functional)
These elements exist in the UI but have no backend implementation:

| Element | Location | Current Behavior |
|---------|----------|------------------|
| "Make it Specific" button | Persona section | Does nothing (mockup) |
| "Agent Analysis" info box | Examples section | Static informational text |
| "AI Analysis Ready" badge | Examples section | Static badge display |

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

### Feature 4: Agent Analysis (Multimodal Vision)
**Status**: UI Placeholder Only
**Complexity**: High (requires Vision API)

**Goal**: Automatically analyze uploaded design screenshots/wireframes to extract visual context.

**What It Would Do**:
1. User uploads a design screenshot or wireframe
2. Vision AI (e.g., Gemini 1.5 Pro) analyzes the image
3. Extracts: colors, spacing, component types, layout patterns
4. Auto-populates a "Visual Context" summary
5. Includes analysis in the generated prompt

**Current State**:
- The blue "Agent Analysis" info box and "AI Analysis Ready" badge are **static UI elements**
- They indicate the feature is designed but awaiting implementation
- No image processing or AI calls occur

**Implementation Required**:
1. Create `app/api/analyze-image/route.ts`
2. Integrate Vision-capable model
3. Add "Scanning..." loading animation
4. Parse and display analysis results

---

## Implementation Priority

For someone wanting to add AI features, recommended order:

1. **Persona Presets** - No API needed, improves UX immediately
2. **AI "Make it Specific"** - Single API route, high value
3. **Smart Suggestions** - Can start with rule-based (no API)
4. **Agent Analysis** - Most complex, requires Vision API

---

## Technical Notes

- **Framework**: Next.js 14+ with App Router
- **API Routes**: Use `app/api/` directory for server-side endpoints
- **Environment Variables**: Store keys in `.env.local` (gitignored)
- **State Management**: React hooks in PromptBuilder component
