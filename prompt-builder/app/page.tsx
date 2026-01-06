import { PromptBuilder } from "@/components/prompt-builder";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-6 md:p-12 lg:pt-12 max-w-[1600px] mx-auto">
            <div className="w-full max-w-7xl z-10 flex flex-col gap-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Prompt Builder
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-[1200px] mx-auto">
                        Create high-quality AI prompts with the strategy: Persona + Context + Constraints & Tech + Examples.
                    </p>
                </div>

                {/* Builder Interface */}
                <PromptBuilder />

                {/* Footer */}
                <footer className="text-center text-sm text-muted-foreground mt-4 pb-8">
                    Created by Lula Rocha |{" "}
                    <a
                        href="https://sugiro.io/ia/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors [font-variant:small-caps]"
                    >
                        sugiro.io
                    </a>
                </footer>

            </div>
        </main>
    );
}