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
    context: string[]
    persona: string[]
    techStack: string[]
}

interface SectionExamplesProps {
    uploadedFiles: FileMetadata[]
    onFilesUpload: (files: File[]) => void
    onFileRemove: (index: number) => void
    customExamples: string
    onCustomExamplesChange: (value: string) => void
    analysisStatus: 'idle' | 'analyzing' | 'complete'
    visualContextSuggestions: VisualContextSuggestions | null
    selectedSuggestions: {
        context: Set<number>
        persona: Set<number>
        techStack: Set<number>
    }
    onToggleSuggestion: (category: 'context' | 'persona' | 'techStack', index: number, suggestion: string) => void
}

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
                <CardTitle className="text-xl -mb-4">4. Examples</CardTitle>
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
                            <h4 className="text-base font-bold text-blue-300">Agent Analysis</h4>
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
                                Upload examples to have the agent extract patterns and suggest improvements for Context, Persona, and Tech Stack.
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
                        <div className="space-y-4 pt-2">
                            <div>
                                <h5 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">Context</h5>
                                <div className="space-y-2">
                                    {visualContextSuggestions.context.map((s, i) => (
                                        <label key={i} className="flex items-start gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedSuggestions.context.has(i)}
                                                onChange={() => onToggleSuggestion('context', i, s)}
                                                className="mt-0.5 w-4 h-4 rounded focus:ring-primary/50 focus:ring-offset-0 cursor-pointer checkbox-blue"
                                            />
                                            <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">{s}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h5 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">Persona</h5>
                                <div className="space-y-2">
                                    {visualContextSuggestions.persona.map((s, i) => (
                                        <label key={i} className="flex items-start gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedSuggestions.persona.has(i)}
                                                onChange={() => onToggleSuggestion('persona', i, s)}
                                                className="mt-0.5 w-4 h-4 rounded focus:ring-primary/50 focus:ring-offset-0 cursor-pointer checkbox-blue"
                                            />
                                            <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">{s}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h5 className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">Tech Stack</h5>
                                <div className="space-y-2">
                                    {visualContextSuggestions.techStack.map((s, i) => (
                                        <label key={i} className="flex items-start gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={selectedSuggestions.techStack.has(i)}
                                                onChange={() => onToggleSuggestion('techStack', i, s)}
                                                className="mt-0.5 w-4 h-4 rounded focus:ring-primary/50 focus:ring-offset-0 cursor-pointer checkbox-blue"
                                            />
                                            <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">{s}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-12 block">Paste Code Snippets</span>
                        <span className="block text-sm text-muted-foreground">Demo usage or existing code patterns.</span>
                        <span className="block text-sm text-white italic">E.g. Paste a snippet of your existing API response or a specific utility function...</span>
                    </div>
                    <Textarea
                        placeholder="Paste your code or text examples here..."
                        className="min-h-[120px] resize-none focus-visible:ring-primary/50 font-mono text-xs"
                        value={customExamples}
                        onChange={(e) => onCustomExamplesChange(e.target.value)}
                    />
                </div>

            </CardContent>
        </Card>
    )
}
