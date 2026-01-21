"use client"

import { useState, useMemo } from "react"
import { SectionPersona } from "./section-persona"
import { SectionContext } from "./section-context"
import { SectionConstraints } from "./section-constraints"
import { SectionExamples } from "./section-examples"
import { GeneratedPrompt } from "./generated-prompt"
import { Sparkles } from "lucide-react"

interface FileMetadata {
    name: string
    size: number
}

export function PromptBuilder() {
    // State
    const [persona, setPersona] = useState("")
    const [context, setContext] = useState("")
    const [selectedTech, setSelectedTech] = useState<string[]>([])
    const [customConstraints, setCustomConstraints] = useState<string[]>([])
    const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>([])
    const [customExamples, setCustomExamples] = useState("")

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

    const handleFilesUpload = (files: File[]) => {
        const fileMetadata = files.map(f => ({ name: f.name, size: f.size }))
        setUploadedFiles(prev => [...prev, ...fileMetadata])
    }

    const handleFileRemove = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    }

    // Derived State: Generated Prompt (using useMemo to prevent hydration mismatch)
    const finalPrompt = useMemo(() => {
        const parts = []

        // Section 1: Context
        if (context.trim()) {
            parts.push(`## 1. Context\n${context.trim()}`)
        } else {
            parts.push(`## 1. Context\n(No information provided yet)`)
        }

        // Section 2: Persona
        if (persona.trim()) {
            parts.push(`## 2. Persona\n${persona.trim()}`)
        } else {
            parts.push(`## 2. Persona\n(No information provided yet)`)
        }

        // Section 3: Constraints & Tech Stack
        if (selectedTech.length > 0 || customConstraints.length > 0) {
            parts.push(`## 3. Constraints & Tech Stack`)
            if (selectedTech.length > 0) {
                parts.push(`**Tech Stack:**\n${selectedTech.map(t => `- ${t}`).join('\n')}`)
            }

            if (customConstraints.length > 0) {
                parts.push(`**Requirements:**\n${customConstraints.map(c => `- ${c}`).join('\n')}`)
            }
        } else {
            parts.push(`## 3. Constraints & Tech Stack\n(No information provided yet)`)
        }

        // Section 4: Examples
        if (uploadedFiles.length > 0 || customExamples.trim()) {
            parts.push(`## 4. Examples`)
            if (customExamples.trim()) {
                parts.push(`**Manual Snippets:**\n${customExamples.trim()}`)
            }

            if (uploadedFiles.length > 0) {
                parts.push(`**Uploaded Files:**\n${uploadedFiles.map(f => `- ${f.name}`).join('\n')}`)
            }
        } else {
            parts.push(`## 4. Examples\n(No information provided yet)`)
        }

        return parts.join('\n\n')
    }, [persona, context, selectedTech, customConstraints, uploadedFiles, customExamples])


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

            {/* Left Column: Input Sections */}
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">

                <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Builder Configuration</h2>
                </div>

                <SectionContext
                    value={context}
                    onChange={setContext}
                />

                <SectionPersona
                    value={persona}
                    onChange={setPersona}
                />

                <SectionConstraints
                    selectedTech={selectedTech}
                    onToggleTech={handleToggleTech}
                    customConstraints={customConstraints}
                    onAddConstraint={handleAddConstraint}
                    onRemoveConstraint={handleRemoveConstraint}
                />

                <SectionExamples
                    uploadedFiles={uploadedFiles}
                    onFilesUpload={handleFilesUpload}
                    onFileRemove={handleFileRemove}
                    customExamples={customExamples}
                    onCustomExamplesChange={setCustomExamples}
                />

            </div>

            {/* Right Column: Preview */}
            <div className="lg:sticky lg:top-8 h-fit space-y-6">

                <div className="flex items-center space-x-2 mb-2">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">Output</h2>
                </div>

                <GeneratedPrompt prompt={finalPrompt} />
            </div>

        </div>
    )
}
