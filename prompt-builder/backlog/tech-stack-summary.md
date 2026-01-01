# Project Tech Stack Summary

This document outlines the technologies and languages used in the Prompt Builder project.

1. **JSON**
For project configuration, dependency management (`package.json`), and compiler settings (`tsconfig.json`).

2. **TypeScript**
For adding static type definitions to the codebase, ensuring type safety in components like `PromptBuilder` and `GeneratedPrompt` to prevent runtime errors.

3. **JavaScript**
For the core logic of the application and the Node.js runtime that executes the Next.js framework scripts.

4. **Next.js (App Router)**
For the overarching framework, managing page routing, professional-grade performance, and providing the secure "Server-Side" layer needed for future AI API integrations.

5. **React**
For the component-based user interface and managing the complex state transitions (like when the prompt updates in real-time as you type).

6. **Tailwind CSS**
For high-speed, utility-first styling that handles the entire layout, responsive behavior, and consistent spacing.

7. **Vanilla CSS**
For specific "premium" customizations in `globals.css`, such as our custom glassmorphism effects, background blurs, and global typography rules.

8. **Lucide React**
For the consistent, high-quality icon system used for actions like "Copy", "Download", and the "Magic" enhancement button.

9. **Markdown**
For maintaining all our project documentation, the feature backlog, and the implementation roadmap inside the `backlog/` directory.
