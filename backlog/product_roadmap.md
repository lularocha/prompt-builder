# Product Roadmap & Feature Status

This document tracks the implementation status and future roadmap for the Prompt Builder application.

**Latest update**: Enhanced Agent Analysis with comprehensive suggestion system:
- Persona: 2 suggestions for developer profile
- Constraints: 3 suggestions for quality standards
- Task: 2 suggestions describing what's being built
- Requirements: 5 suggestions (2 features + 1 visual style + 1 layout + 1 interactions)
- Tech: 3 technology recommendations

Also added project title feature with numbered prompt structure (1. System Prompt, 2. User Prompt).

---

## Current Implementation Status

### Completed (MVP)
- **Premium UI**: Glassmorphism design, dark theme, responsive layout
- **2-Part Prompt Strategy**: System Prompt (Persona + Constraints) + User Prompt (Task + Requirements + Tech + Examples)
- **Numbered Prompt Structure**: Generated prompts organized as "1. System Prompt" and "2. User Prompt"
- **Project Title**: Custom naming with automatic inclusion in exports and display
- **Prompt Generation**: Real-time assembly of inputs into formatted markdown
- **Copy & Download**: Export generated prompts as markdown with project title
- **File Upload**: Drag & drop zone for reference files (images, PDFs, code)
- **Code Snippets**: Textarea for pasting example code
- **Agent Analysis (Vision API)**: AI-powered image analysis with Claude Sonnet 4
  - Upload design screenshots or wireframes
  - Automatic extraction of visual patterns using Claude Vision
  - Comprehensive suggestion system:
    - **Persona**: 2 suggestions for ideal developer profile
    - **Constraints**: 3 suggestions for behavioral rules and quality standards
    - **Task**: 2 suggestions describing what is being built
    - **Requirements**: 5 suggestions covering features (2), visual style (1), layout patterns (1), and interactions (1)
    - **Tech**: 3 specific technology recommendations
  - Interactive checkboxes for each suggestion
  - One-click population of corresponding sections
  - Automatic duplicate prevention
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
2. Claude Sonnet 4 Vision API analyzes the image
3. Extracts patterns: layout structure, component types, visual context, interactions
4. Returns AI-generated suggestions in five categories:
   - **Persona**: 2 suggestions for ideal developer profile (e.g., "Senior frontend developer with React and data visualization experience")
   - **Constraints**: 3 suggestions for behavioral rules or quality standards (e.g., "Follow accessibility standards for data-heavy interfaces")
   - **Task**: 2 suggestions describing what is being built (e.g., "Build a real-time analytics dashboard")
   - **Requirements**: 5 comprehensive suggestions:
     - 2 describing specific features visible in the design (e.g., "Display metrics in card grid layout")
     - 1 describing the visual style/look and feel (e.g., "Modern minimalist design with subtle shadows")
     - 1 describing layout patterns observed (e.g., "Sidebar navigation with main content area")
     - 1 describing interactions or behavior (e.g., "Hover states on interactive elements")
   - **Tech**: 3 specific technology recommendations (e.g., "React", "Tailwind CSS", "Chart.js")
5. Interactive checkboxes allow users to select which suggestions to add
6. Selected suggestions automatically populate corresponding sections
7. Automatic duplicate prevention and removal when unchecked

**Technical Implementation**:
- Server-side API route: `app/api/analyze-image/route.ts`
- Uses `@anthropic-ai/sdk` with Claude Sonnet 4 (model: claude-sonnet-4-20250514)
- Client converts images to base64 and sends to API
- Structured JSON response with 15 total suggestions across 5 categories
- Loading states: Idle → Analyzing → Complete
- Smart duplicate prevention when adding suggestions
- Environment variable: `ANTHROPIC_API_KEY` (secured in `.env.local` and Vercel)
- Concise suggestions (under 80 characters each)

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
