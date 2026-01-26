# Prompt Structure Template

A two-level framework for structuring prompts: system-level (reusable) and user-level (task-specific).

---

## System Prompt (Reusable)

Define persona and constraints that apply across multiple tasks in the same domain.

```markdown
## Persona
Senior frontend developer specializing in fintech and cryptocurrency applications.
Experienced with financial data display patterns, real-time price feeds,
and currency formatting best practices.

## Constraints
- Prioritize readability for financial figures (proper decimal places, thousand separators)
- Handle API failures gracefully — never show stale prices without indication
- Follow accessibility standards for high-contrast financial displays
```

### What belongs here:
- **Persona**: Domain expertise, role, perspective
- **Constraints**: Behavioral rules, quality standards, things to always/never do

### Characteristics:
- Reusable across similar projects
- Defines *how* the AI should think and behave
- Sets expertise level and domain knowledge

---

## User Prompt (Task-Specific)

Define the specific task, requirements, tech stack, and visual references.

```markdown
## Task
Build a Bitcoin wallet balance dashboard.

## Requirements
- Display BTC balance with live USD conversion
- Show current Bitcoin price from CoinGecko API
- Auto-refresh price every 60 seconds
- Bright yellow branded design (#FFD700)

## Tech
- React + Vite
- Styled Components

## Reference
[attached screenshot] — extract layout, typography, and color patterns from this
```

### What belongs here:
- **Task**: Clear action verb + what to build
- **Requirements**: Functional specifications, features, behavior
- **Tech**: Stack, frameworks, libraries, APIs
- **Reference**: Screenshots, mockups, examples for vision-based pattern extraction

### Characteristics:
- Specific to this one request
- Defines *what* to build
- Changes with each task

---

## Summary

| Level | Contains | Reusable? | Purpose |
|-------|----------|-----------|---------|
| System | Persona, constraints | Yes | *How* to approach tasks |
| User | Task, requirements, tech, reference | No | *What* to build |

---

## How to Use with Claude Code

### Step 1: Create project folder

```bash
mkdir ~/Projects/crypto-dashboard
cd ~/Projects/crypto-dashboard
```

### Step 2: Add CLAUDE.md with persona and constraints

Create a `CLAUDE.md` file in the project root. This acts as your "system prompt" — it loads automatically when you start Claude Code in this folder.

```
~/Projects/crypto-dashboard/
├── CLAUDE.md          ← Contains persona + constraints
├── package.json
└── src/
```

The CLAUDE.md contains the system-level content:

```markdown
# Crypto Dashboard

## Persona
Senior frontend developer specializing in fintech and cryptocurrency applications.
Experienced with financial data display patterns, real-time price feeds,
and currency formatting best practices.

## Constraints
- Prioritize readability for financial figures (proper decimal places, thousand separators)
- Handle API failures gracefully — never show stale prices without indication
- Follow accessibility standards for high-contrast financial displays
```

### Step 3: Start Claude Code

```bash
claude
```

### Step 4: Send your first message (the user prompt)

Use the structured format for your initial request:

```markdown
## Task
Build a Bitcoin wallet balance dashboard.

## Requirements
- Display BTC balance with live USD conversion
- Show current Bitcoin price from CoinGecko API
- Auto-refresh price every 60 seconds
- Bright yellow branded design (#FFD700)

## Tech
- React + Vite
- Styled Components

## Reference
[paste or drag screenshot]
```

### Step 5: Iterate naturally

After the initial structured prompt, continue with natural follow-up messages:

- "Make the refresh interval configurable"
- "Add error handling for API failures"
- "The price format needs thousand separators"
- "Run the tests and fix any issues"

The CLAUDE.md persona stays loaded throughout the session, guiding how Claude approaches each refinement.

---

## File Hierarchy

For projects within a shared workspace:

```
~/ClaudeCode/
├── CLAUDE.md                         ← Global rules (all projects)
└── Projects/
    ├── crypto-dashboard/
    │   └── CLAUDE.md                 ← Domain-specific persona (fintech)
    ├── blog-engine/
    │   └── CLAUDE.md                 ← Domain-specific persona (content/CMS)
    └── api-service/
        └── CLAUDE.md                 ← Domain-specific persona (backend)
```

Claude Code merges all CLAUDE.md files from parent directories, so you get:
- **Global rules** (from parent) + **Project persona** (from project folder)
