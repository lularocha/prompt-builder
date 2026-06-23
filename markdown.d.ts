// Lets TypeScript treat `import x from "./file.md"` as a raw string,
// matching the webpack `asset/source` rule in next.config.js.
declare module "*.md" {
  const content: string;
  export default content;
}
