import { PromptBuilder } from "@/components/prompt-builder";
import { InfoModal } from "@/components/info-modal";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-5 md:p-12 lg:pt-12 max-w-[1600px] mx-auto">
      <div className="w-full max-w-7xl z-10 flex flex-col gap-12">
        {/* Header */}
        <div className="text-left space-y-4">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl md:text-6xl font-semibold md:font-normal tracking-tighter text-white">
              Prompt Builder
            </h1>
            <InfoModal />
          </div>
          <p className="text-lg text-muted-foreground max-w-[1200px]">
            Create high-quality System and User Prompts with AI.
          </p>
        </div>

        {/* Builder Interface */}
        <PromptBuilder />

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground mt-4 pb-8">
          <p>
            <span style={{ color: "rgb(250, 250, 250)" }}>
              developed by Lula Rocha /
            </span>{" "}
            <a
              href="https://sugiro.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "#f80", fontWeight: 500 }}
            >
              sugiro.ai
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
