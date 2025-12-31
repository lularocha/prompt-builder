import { PromptBuilder } from "@/components/prompt-builder";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-6 md:p-12 lg:p-24 max-w-[1600px] mx-auto">
            <div className="w-full max-w-7xl z-10 flex flex-col gap-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                        Prompt Architect
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
                        Build production-ready prompts using the Context + Constraints + Examples strategy.
                    </p>
                </div>

                {/* Builder Interface */}
                <PromptBuilder />

            </div>
        </main>
    );
}
