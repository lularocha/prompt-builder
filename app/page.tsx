import { PromptBuilder } from "@/components/prompt-builder";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-6 md:p-12 lg:pt-12 max-w-[1600px] mx-auto">
            <div className="w-full max-w-7xl z-10 flex flex-col gap-12">

                {/* Header */}
                <div className="text-left space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
                        Prompt Builder
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-[1200px]">
                        Create high-quality AI prompts with the strategy: Context + Persona + Tech Stack & Constraints + Examples.
                    </p>
                    <p className="text-sm text-[#ffaa00] !mt-2">
                        Latest update: January 25, 2026
                    </p>
                </div>

                {/* Builder Interface */}
                <PromptBuilder />

                {/* Footer */}
                <footer className="text-center text-sm text-muted-foreground mt-4 pb-8 space-y-2">
                    <div className="font-bold">Created by Lula Rocha + Claude</div>
                    <div>
                        Claude has an AI powered{" "}
                        <a
                            href="https://platform.claude.com/dashboard"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-400 hover:underline transition-colors font-bold"
                        >
                            Prompt Tool
                        </a>
                        {" "}in the Developer Platform (requires API account with credits).
                    </div>
                </footer>

            </div>
        </main>
    );
}