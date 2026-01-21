"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Upload, FileText, BrainCircuit, X } from "lucide-react"
import { useRef, useState } from "react"

interface FileMetadata {
    name: string
    size: number
}

interface SectionExamplesProps {
    uploadedFiles: FileMetadata[]
    onFilesUpload: (files: File[]) => void
    onFileRemove: (index: number) => void
    customExamples: string
    onCustomExamplesChange: (value: string) => void
}

export function SectionExamples({
    uploadedFiles,
    onFilesUpload,
    onFileRemove,
    customExamples,
    onCustomExamplesChange
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
                <CardTitle className="text-xl">4. Examples</CardTitle>
                <CardDescription>
                    Show, don't tell - Upload files or paste code snippets to demonstrate usage.
                    <span className="block text-white italic mt-1">Note: Automatic extraction of patterns from visual files (images, screenshots) is not yet implemented.</span>
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
                    className="border-2 border-dashed border-white/10 rounded-xl p-8 mb-12 flex flex-col items-center justify-center text-center transition-colors hover:border-primary/30 hover:bg-white/5 cursor-pointer group"
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

                {/*
                    Badge states (for future implementation):
                    - idle: bg-gray-600 text-white
                    - analyzing: bg-yellow-500 text-black
                    - complete: bg-green-600 text-white
                    - error: bg-red-600 text-white
                */}
                <Badge variant="secondary" className="bg-gray-600 text-white border-0 w-fit">
                    <BrainCircuit className="w-3 h-3 mr-1" />
                    AI Analysis Idle
                </Badge>

                <div className="p-4 rounded-lg bg-blue-500/5 flex gap-3">
                    <div className="shrink-0 mt-0.5">
                        <BrainCircuit className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-blue-300">Agent Analysis</h4>
                        <p className="text-xs text-blue-200/60">
                            Upload an example to have the agent extract patterns and suggest improvements.
                        </p>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/5 space-y-3">
                    <h4 className="text-sm font-bold text-white">Visual Context:</h4>
                    <p className="text-sm text-muted-foreground font-normal italic">
                        Suggestions will appear here once AI analysis is implemented. The agent will extract patterns from uploaded images and offer recommendations for Context, Persona, and Tech Stack.
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Paste Code Snippets</span>
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
