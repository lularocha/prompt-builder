"use client"

import { useState, useEffect } from "react"
import { SectionContext } from "./section-context"
import { SectionConstraints } from "./section-constraints"
import { SectionExamples } from "./section-examples"
import { GeneratedPrompt } from "./generated-prompt"
import { Sparkles } from "lucide-react"

export function PromptBuilder() {
    // State
    const [context, setContext] = useState("")
    const [selectedTech, setSelectedTech] = useState<string[]>([])
    const [customConstraints, setCustomConstraints] = useState<string[]>([])

    // Handlers
    const handleToggleTech = (tech: string) => {
        setSelectedTech(prev =>
            prev.includes(tech)
                ? prev.filter(t => t !== tech)
                : [...prev, tech]
        )
    }

    const handleAddConstraint = (constraint: string) => {
        setCustomConstraints(prev => [...prev, constraint])
    }

    const handleRemoveConstraint = (index: number) => {
        setCustomConstraints(prev => prev.filter((_, i) => i !== index))
    }

    // Derived State: Generated Prompt
    const generatePrompt = () => {
        const parts = []

        if (context.trim()) {
            parts.push(`## 1. Context\n${context.trim()}`)
        }

        if (selectedTech.length > 0 || customConstraints.length > 0) {
            parts.push(`## 2. Constraints & Tech Stack`)

            if (selectedTech.length > 0) {
                parts.push(`**Tech Stack:**\n${selectedTech.map(t => `- ${t}`).join('\n')}`)
            }

            if (customConstraints.length > 0) {
                parts.push(`**Requirements:**\n${customConstraints.map(c => `- ${c}`).join('\n')}`)
            }
        }

        // Static example placeholder for now as we don't have real file parsing yet
        parts.push(`## 3. Examples\n(No examples provided yet. Upload files to add specific patterns.)`)

        return parts.join('\n\n')
    }

    const [finalPrompt, setFinalPrompt] = useState("")

    useEffect(() => {
        setFinalPrompt(generatePrompt())
    }, [context, selectedTech, customConstraints])


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

            {/* Left Column: Input Sections */}
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">

                <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold tracking-tight">Builder Configuration</h2>
                </div>

                <SectionContext
                    value={context}
                    onChange={setContext}
                />

                <SectionConstraints
                    selectedTech={selectedTech}
                    onToggleTech={handleToggleTech}
                    customConstraints={customConstraints}
                    onAddConstraint={handleAddConstraint}
                    onRemoveConstraint={handleRemoveConstraint}
                />

                <SectionExamples />

            </div>

            {/* Right Column: Preview */}
            <div className="lg:sticky lg:top-8 h-fit">
                <div className="flex items-center space-x-2 mb-8 lg:mb-2">
                    {/* Spacer for alignment on desktop, title on mobile */}
                    <h2 className="text-xl font-semibold tracking-tight lg:hidden">Output</h2>
                </div>
                <GeneratedPrompt prompt={finalPrompt} />
            </div>

        </div>
    )
}
