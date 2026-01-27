"use client"

import { useState, useMemo } from "react"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { SectionSystemPrompt } from "./section-system-prompt"
import { SectionUserPrompt } from "./section-user-prompt"
import { SectionExamples } from "./section-examples"
import { GeneratedPrompt } from "./generated-prompt"

interface FileMetadata {
    name: string
    size: number
}

interface VisualContextSuggestions {
    persona: string[]
    constraints: string[]
    task: string[]
    requirements: string[]
    tech: string[]
}

type SuggestionCategory = 'persona' | 'constraints' | 'task' | 'requirements' | 'tech'

export function PromptBuilder() {
    // State
    const [persona, setPersona] = useState("")
    const [constraints, setConstraints] = useState("")
    const [task, setTask] = useState("")
    const [requirements, setRequirements] = useState("")
    const [tech, setTech] = useState("")
    const [uploadedFiles, setUploadedFiles] = useState<FileMetadata[]>([])
    const [customExamples, setCustomExamples] = useState("")
    const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle')
    const [visualContextSuggestions, setVisualContextSuggestions] = useState<VisualContextSuggestions | null>(null)
    const [selectedSuggestions, setSelectedSuggestions] = useState<Record<SuggestionCategory, Set<number>>>({
        persona: new Set(),
        constraints: new Set(),
        task: new Set(),
        requirements: new Set(),
        tech: new Set()
    })

    // Handlers
    const handleFilesUpload = async (files: File[]) => {
        const fileMetadata = files.map(f => ({ name: f.name, size: f.size }))
        setUploadedFiles(prev => [...prev, ...fileMetadata])

        // Find the first image file for analysis
        const imageFile = files.find(f => f.type.startsWith('image/'))

        if (!imageFile) {
            return
        }

        // Start analysis
        setAnalysisStatus('analyzing')
        setVisualContextSuggestions(null)
        setSelectedSuggestions({
            persona: new Set(),
            constraints: new Set(),
            task: new Set(),
            requirements: new Set(),
            tech: new Set()
        })

        try {
            // Read image as base64
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onload = () => {
                    const result = reader.result as string
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
        }
    }

    const handleFileRemove = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleToggleSuggestion = (category: SuggestionCategory, index: number, suggestion: string) => {
        const setterMap: Record<SuggestionCategory, React.Dispatch<React.SetStateAction<string>>> = {
            persona: setPersona,
            constraints: setConstraints,
            task: setTask,
            requirements: setRequirements,
            tech: setTech,
        }

        // Categories that should be formatted as list items
        const listCategories: SuggestionCategory[] = ['constraints', 'requirements', 'tech']
        const shouldFormatAsList = listCategories.includes(category)

        setSelectedSuggestions(prev => {
            const newSet = new Set(prev[category])
            const isSelected = newSet.has(index)
            const setter = setterMap[category]

            if (isSelected) {
                newSet.delete(index)
                setter(prevVal => {
                    // Remove the suggestion, handling both with and without "- " prefix
                    const lines = prevVal.split('\n').filter(line => {
                        const trimmedLine = line.trim()
                        const withoutPrefix = trimmedLine.replace(/^-\s*/, '')
                        return withoutPrefix !== suggestion.trim() && trimmedLine !== suggestion.trim()
                    })
                    return lines.join('\n')
                })
            } else {
                newSet.add(index)
                setter(prevVal => {
                    const trimmed = prevVal.trim()
                    const lines = trimmed.split('\n').map(l => l.trim())

                    // Check if suggestion already exists (with or without prefix)
                    const suggestionExists = lines.some(line => {
                        const withoutPrefix = line.replace(/^-\s*/, '')
                        return withoutPrefix === suggestion.trim() || line === suggestion.trim()
                    })

                    if (suggestionExists) {
                        return trimmed
                    }

                    // Format as list item if needed
                    const formattedSuggestion = shouldFormatAsList ? `- ${suggestion}` : suggestion
                    return trimmed ? `${trimmed}\n${formattedSuggestion}` : formattedSuggestion
                })
            }

            return { ...prev, [category]: newSet }
        })
    }

    // Derived State: Generated Prompt
    const finalPrompt = useMemo(() => {
        const systemParts: string[] = []
        const userParts: string[] = []

        // --- SYSTEM PROMPT ---
        if (persona.trim()) {
            systemParts.push(`## Persona\n${persona.trim()}`)
        } else {
            systemParts.push(`## Persona\n(No information provided yet)`)
        }

        if (constraints.trim()) {
            systemParts.push(`## Constraints\n${constraints.trim()}`)
        } else {
            systemParts.push(`## Constraints\n(No information provided yet)`)
        }

        // --- USER PROMPT ---
        if (task.trim()) {
            userParts.push(`## Task\n${task.trim()}`)
        } else {
            userParts.push(`## Task\n(No information provided yet)`)
        }

        if (requirements.trim()) {
            userParts.push(`## Requirements\n${requirements.trim()}`)
        } else {
            userParts.push(`## Requirements\n(No information provided yet)`)
        }

        if (tech.trim()) {
            userParts.push(`## Tech\n${tech.trim()}`)
        } else {
            userParts.push(`## Tech\n(No information provided yet)`)
        }

        // Examples
        if (uploadedFiles.length > 0 || customExamples.trim()) {
            const exParts: string[] = []
            if (customExamples.trim()) {
                exParts.push(`**Code Snippets:**\n${customExamples.trim()}`)
            }
            if (uploadedFiles.length > 0) {
                exParts.push(`**Uploaded Files:**\n${uploadedFiles.map(f => `- ${f.name}`).join('\n')}`)
            }
            userParts.push(`## Examples\n${exParts.join('\n\n')}`)
        } else {
            userParts.push(`## Examples\n(No information provided yet)`)
        }

        // Assemble final prompt
        const parts: string[] = []
        parts.push(`# System Prompt\n\n${systemParts.join('\n\n')}`)
        parts.push(`---`)
        parts.push(`# User Prompt\n\n${userParts.join('\n\n')}`)

        return parts.join('\n\n')
    }, [persona, constraints, task, requirements, tech, uploadedFiles, customExamples])


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

                <SectionSystemPrompt
                    persona={persona}
                    onPersonaChange={setPersona}
                    constraints={constraints}
                    onConstraintsChange={setConstraints}
                />

                <SectionUserPrompt
                    task={task}
                    onTaskChange={setTask}
                    requirements={requirements}
                    onRequirementsChange={setRequirements}
                    tech={tech}
                    onTechChange={setTech}
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
