export type Locale = "en" | "pt";

// Display label for each locale (PT shows as "BR" per request).
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  pt: "BR",
};

export const translations = {
  en: {
    "header.tagline": "Create System and User Prompts with AI.",
    "footer.developedBy": "developed by Lula Rocha /",

    "generate.button": "Generate Prompt",
    "generate.loading": "Generating...",

    "task.title": "What do you want to build?",
    "task.description":
      "Describe your project, feature, or task. AI will write the prompt for you.",
    "task.placeholder":
      "Example: Build a responsive admin dashboard for a SaaS platform with real-time analytics, user management, and dark mode.",

    "upload.title": "Add context (optional)",
    "upload.description":
      "Upload a screenshot or mockup, or paste code, to guide the AI.",
    "upload.cta": "Upload a screenshot or mockup",
    "upload.formats": "Images (PNG, JPG, GIF, SVG, WebP)",
    "upload.uploadedFiles": "Uploaded Files:",
    "upload.pasteTitle": "Paste Code Snippets",
    "upload.pasteDescription": "Existing code or patterns the AI should follow.",
    "upload.pastePlaceholder": "Paste your code or text examples here...",

    "output.title": "Generated Prompt",
    "output.download": "Download",
    "output.copy": "Copy",
    "output.copied": "Copied",
    "output.nameProject": "Name your Project",
    "output.defaultTitle": "Project Title",
    "output.placeholder":
      "Your AI-generated prompt will appear here. You can edit it freely once it's generated.",
    "output.generating": "Generating your prompt...",
  },
  pt: {
    "header.tagline": "Crie prompts de sistema e de usuário com IA.",
    "footer.developedBy": "desenvolvido por Lula Rocha /",

    "generate.button": "Gerar Prompt",
    "generate.loading": "Gerando...",

    "task.title": "O que você quer construir?",
    "task.description":
      "Descreva seu projeto, funcionalidade ou tarefa. A IA vai escrever o prompt para você.",
    "task.placeholder":
      "Exemplo: Crie um painel administrativo responsivo para uma plataforma SaaS com análises em tempo real, gerenciamento de usuários e modo escuro.",

    "upload.title": "Adicione contexto (opcional)",
    "upload.description":
      "Envie uma captura de tela ou mockup, ou cole código, para guiar a IA.",
    "upload.cta": "Envie uma captura de tela ou mockup",
    "upload.formats": "Imagens (PNG, JPG, GIF, SVG, WebP)",
    "upload.uploadedFiles": "Arquivos enviados:",
    "upload.pasteTitle": "Cole trechos de código",
    "upload.pasteDescription":
      "Código existente ou padrões que a IA deve seguir.",
    "upload.pastePlaceholder": "Cole seu código ou exemplos de texto aqui...",

    "output.title": "Prompt Gerado",
    "output.download": "Baixar",
    "output.copy": "Copiar",
    "output.copied": "Copiado",
    "output.nameProject": "Nomeie seu projeto",
    "output.defaultTitle": "Título do Projeto",
    "output.placeholder":
      "Seu prompt gerado por IA aparecerá aqui. Você pode editá-lo livremente após a geração.",
    "output.generating": "Gerando seu prompt...",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];
