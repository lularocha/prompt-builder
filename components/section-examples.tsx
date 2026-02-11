"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Upload, FileText, BrainCircuit, X } from "lucide-react"
import { useRef } from "react"

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

interface SectionExamplesProps {
    uploadedFiles: FileMetadata[]
    onFilesUpload: (files: File[]) => void
    onFileRemove: (index: number) => void
    customExamples: string
    onCustomExamplesChange: (value: string) => void
    analysisStatus: 'idle' | 'analyzing' | 'complete'
    visualContextSuggestions: VisualContextSuggestions | null
    selectedSuggestions: Record<SuggestionCategory, Set<number>>
    onToggleSuggestion: (category: SuggestionCategory, index: number, suggestion: string) => void
}

const SUGGESTION_GROUPS: { key: SuggestionCategory; label: string }[] = [
    { key: 'persona', label: 'Persona' },
    { key: 'constraints', label: 'Constraints' },
    { key: 'task', label: 'Task' },
    { key: 'requirements', label: 'Requirements' },
    { key: 'tech', label: 'Tech' },
]

export function SectionExamples({
    uploadedFiles,
    onFilesUpload,
    onFileRemove,
    customExamples,
    onCustomExamplesChange,
    analysisStatus,
    visualContextSuggestions,
    selectedSuggestions,
    onToggleSuggestion
}: SectionExamplesProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            onFilesUpload(files)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-[1.5rem]">Examples</CardTitle>
                <CardDescription className="pb-8">
                    Provide reference files and code to guide AI understanding.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.txt,.rtf,.js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.html,.css,.json,.md,.png,.jpg,.jpeg,.gif,.svg,.webp"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <div
                    onClick={handleUploadClick}
                    className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-primary/30 hover:bg-white/5 cursor-pointer group"
                >
                    <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                    </div>
                    <h4 className="text-sm font-medium mb-1">Upload Reference Files</h4>
                    <p className="text-xs text-muted-foreground">Images (PNG, JPG), PDFs, Code files, or Text files</p>
                </div>

                {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Uploaded Files:</h4>
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-black/20 group">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-primary" />
                                    <span className="text-sm text-gray-300">{file.name}</span>
                                    <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                                </div>
                                <button
                                    onClick={() => onFileRemove(index)}
                                    className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="p-4 rounded-lg bg-blue-500/10 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-blue-400" />
                            <h4 className="text-base font-bold text-blue-400">Agent Analysis</h4>
                        </div>
                        {analysisStatus === 'idle' && (
                            <Badge variant="secondary" className="bg-gray-600 text-white border-0 text-sm px-3.5 py-1">
                                <BrainCircuit className="w-3 h-3 mr-1" />
                                Idle
                            </Badge>
                        )}
                        {analysisStatus === 'analyzing' && (
                            <Badge variant="secondary" className="border-0 text-black text-sm px-3.5 py-1 animate-glow-orange">
                                <BrainCircuit className="w-3 h-3 mr-1" />
                                Analyzing...
                            </Badge>
                        )}
                        {analysisStatus === 'complete' && (
                            <Badge variant="secondary" className="bg-green-600 text-white border-0 text-sm px-3.5 py-1">
                                <BrainCircuit className="w-3 h-3 mr-1" />
                                Complete
                            </Badge>
                        )}
                    </div>
                    {!visualContextSuggestions && (
                        <>
                            <div className="text-sm text-white">
                                Upload examples to have the agent extract patterns and suggest improvements for Persona, Constraints, Task, Requirements, and Tech.
                            </div>
                            <div className="text-sm text-muted-foreground italic">
                                Suggestions will appear here once AI analysis is completed.
                            </div>
                        </>
                    )}
                    {visualContextSuggestions && (
                        <>
                            <div className="text-sm text-white font-medium">
                                Suggestions based on the examples provided:
                            </div>
                        </>
                    )}
                    {visualContextSuggestions && (
                        <div className="space-y-6 pt-2">
                            {/* System Prompt Section */}
                            <div className="space-y-4">
                                <h3 className="text-[1rem] font-bold text-white">1. System Prompt</h3>
                                {SUGGESTION_GROUPS.filter(({ key }) => key === 'persona' || key === 'constraints').map(({ key, label }) => (
                                    <div key={key}>
                                        <h4 className="text-xl font-semibold text-blue-400 mb-2">{label}</h4>
                                        <div className="space-y-2">
                                            {visualContextSuggestions[key].map((s, i) => (
                                                <label key={i} className="flex items-start gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSuggestions[key].has(i)}
                                                        onChange={() => onToggleSuggestion(key, i, s)}
                                                        className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-white/10 text-primary focus:ring-primary/50 focus:ring-offset-0 cursor-pointer"
                                                    />
                                                    <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">{s}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Separator */}
                            <div className="border-t border-white/10"></div>

                            {/* User Prompt Section */}
                            <div className="space-y-4">
                                <h3 className="text-[1rem] font-bold text-white">2. User Prompt</h3>
                                {SUGGESTION_GROUPS.filter(({ key }) => key === 'task' || key === 'requirements' || key === 'tech').map(({ key, label }) => (
                                    <div key={key}>
                                        <h4 className="text-xl font-semibold text-blue-400 mb-2">{label}</h4>
                                        <div className="space-y-2">
                                            {visualContextSuggestions[key].map((s, i) => (
                                                <label key={i} className="flex items-start gap-2 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSuggestions[key].has(i)}
                                                        onChange={() => onToggleSuggestion(key, i, s)}
                                                        className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-white/10 text-primary focus:ring-primary/50 focus:ring-offset-0 cursor-pointer"
                                                    />
                                                    <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">{s}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-xl font-bold text-blue-400 mt-12 block">Paste Code Snippets</h4>
                        <span className="block text-sm text-muted-foreground">Demo usage or existing code patterns.</span>
                    </div>
                    <Textarea
                        placeholder="Paste your code or text examples here..."
                        className="min-h-[120px] focus-visible:ring-primary/50 font-mono text-xs"
                        value={customExamples}
                        onChange={(e) => onCustomExamplesChange(e.target.value)}
                    />
                </div>

            </CardContent>
        </Card>
    )
}
