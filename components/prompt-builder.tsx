"use client"

import { useState, useMemo } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { SectionPersona } from "./section-persona"
import { SectionContext } from "./section-context"
import { SectionConstraints } from "./section-constraints"
import { SectionExamples } from "./section-examples"
import { GeneratedPrompt } from "./generated-prompt"

interface FileMetadata {
    name: string
    size: number
}

interface VisualContextSuggestions {
    context: string[]
    persona: string[]
    techStack: string[]
}

export function PromptBuilder() {
    // State
    const [persona, setPersona] = useState("")
    const [context, setContext] = useState("")
    const [selectedTech, setSelectedTech] = useState<string[]>([])
    const [customConstraints, setCustomConstraints] = useState<string[]>([])
    const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>([])
    const [customExamples, setCustomExamples] = useState("")
    const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle')
    const [visualContextSuggestions, setVisualContextSuggestions] = useState<VisualContextSuggestions | null>(null)
    const [selectedSuggestions, setSelectedSuggestions] = useState<{
        context: Set<number>
        persona: Set<number>
        techStack: Set<number>
    }>({
        context: new Set(),
        persona: new Set(),
        techStack: new Set()
    })

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

    const handleFilesUpload = async (files: File[]) => {
        const fileMetadata = files.map(f => ({ name: f.name, size: f.size }))
        setUploadedFiles(prev => [...prev, ...fileMetadata])

        // Find the first image file for analysis
        const imageFile = files.find(f => f.type.startsWith('image/'))

        if (!imageFile) {
            // No image to analyze, skip API call
            return
        }

        // Start analysis
        setAnalysisStatus('analyzing')
        setVisualContextSuggestions(null)
        setSelectedSuggestions({
            context: new Set(),
            persona: new Set(),
            techStack: new Set()
        })

        try {
            // Read image as base64
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                    const result = reader.result as string
                    // Remove data URL prefix (e.g., "data:image/png;base64,")
                    const base64Data = result.split(',')[1]
                    resolve(base64Data)
                }
                reader.onerror = reject
                reader.readAsDataURL(imageFile)
            })

            // Call API
            const response = await fetch('/api/analyze-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image: base64,
                    mediaType: imageFile.type
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Analysis failed')
            }

            const suggestions = await response.json()
            setAnalysisStatus('complete')
            setVisualContextSuggestions(suggestions)
        } catch (error) {
            console.error('Analysis error:', error)
            setAnalysisStatus('idle')
            // Optionally show error to user - for now just log it
        }
    }

    const handleFileRemove = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleToggleSuggestion = (category: 'context' | 'persona' | 'techStack', index: number, suggestion: string) => {
        setSelectedSuggestions(prev => {
            const newSet = new Set(prev[category])
            const isSelected = newSet.has(index)

            if (isSelected) {
                newSet.delete(index)
                // Remove suggestion from corresponding field
                if (category === 'context') {
                    setContext(prevContext => {
                        const lines = prevContext.split('\n').filter(line => line.trim() !== suggestion.trim())
                        return lines.join('\n')
                    })
                } else if (category === 'persona') {
                    setPersona(prevPersona => {
                        const lines = prevPersona.split('\n').filter(line => line.trim() !== suggestion.trim())
                        return lines.join('\n')
                    })
                } else if (category === 'techStack') {
                    // Check if it's a preset tech or custom constraint
                    const PRESET_TECH = ["HTML", "CSS", "Vanilla JS", "TypeScript", "React", "Vue", "Next.js", "Tailwind CSS", "Node.js", "Python"]
                    if (PRESET_TECH.includes(suggestion)) {
                        setSelectedTech(prev => prev.filter(t => t !== suggestion))
                    } else {
                        setCustomConstraints(prev => prev.filter(c => c !== suggestion))
                    }
                }
            } else {
                newSet.add(index)
                // Add suggestion to corresponding field
                if (category === 'context') {
                    setContext(prevContext => {
                        const trimmed = prevContext.trim()
                        // Check if suggestion already exists to prevent duplicates
                        const lines = trimmed.split('\n').map(l => l.trim())
                        if (lines.includes(suggestion.trim())) {
                            return trimmed
                        }
                        return trimmed ? `${trimmed}\n${suggestion}` : suggestion
                    })
                } else if (category === 'persona') {
                    setPersona(prevPersona => {
                        const trimmed = prevPersona.trim()
                        // Check if suggestion already exists to prevent duplicates
                        const lines = trimmed.split('\n').map(l => l.trim())
                        if (lines.includes(suggestion.trim())) {
                            return trimmed
                        }
                        return trimmed ? `${trimmed}\n${suggestion}` : suggestion
                    })
                } else if (category === 'techStack') {
                    // Check if it's a preset tech or custom constraint
                    const PRESET_TECH = ["HTML", "CSS", "Vanilla JS", "TypeScript", "React", "Vue", "Next.js", "Tailwind CSS", "Node.js", "Python"]
                    if (PRESET_TECH.includes(suggestion)) {
                        setSelectedTech(prev => prev.includes(suggestion) ? prev : [...prev, suggestion])
                    } else {
                        setCustomConstraints(prev => prev.includes(suggestion) ? prev : [...prev, suggestion])
                    }
                }
            }

            return { ...prev, [category]: newSet }
        })
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
                    <div className="p-0 bg-primary/20 rounded-lg flex items-center">
                        <ArrowDownRight className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-[1.75rem] font-bold tracking-tight leading-none">Input</h2>
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
                    analysisStatus={analysisStatus}
                    visualContextSuggestions={visualContextSuggestions}
                    selectedSuggestions={selectedSuggestions}
                    onToggleSuggestion={handleToggleSuggestion}
                />

            </div>

            {/* Right Column: Preview */}
            <div className="lg:sticky lg:top-8 h-fit space-y-6">

                <div className="flex items-center space-x-2 mb-2">
                    <div className="p-0 bg-primary/20 rounded-lg flex items-center">
                        <ArrowUpRight className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-[1.75rem] font-bold tracking-tight leading-none">Output</h2>
                </div>

                <GeneratedPrompt prompt={finalPrompt} />
            </div>

        </div>
    )
}
