/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Import .md files as raw strings so PROMPT_RULES.md can be the single
    // source of truth for the generation rules (used by the API route's system
    // prompt and the in-app "Prompt Rules" modal).
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });
    return config;
  },
};

module.exports = nextConfig;
