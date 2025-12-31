import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Upload, FileText, BrainCircuit } from "lucide-react"

export function SectionExamples() {
    return (
        <Card className="glass-panel border-0 bg-opacity-50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">3. Examples (Show, don’t tell)</CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <BrainCircuit className="w-3 h-3 mr-1" />
                        AI Analysis Ready
                    </Badge>
                </div>
                <CardDescription>Upload files or paste code snippets to demonstrate usage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

                <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-primary/30 hover:bg-white/5 cursor-pointer group">
                    <div className="p-4 rounded-full bg-white/5 mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary" />
                    </div>
                    <h4 className="text-sm font-medium mb-1">Upload Reference Files</h4>
                    <p className="text-xs text-muted-foreground">PDF, TXT, RTF, or Code files</p>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3">
                    <div className="shrink-0 mt-0.5">
                        <BrainCircuit className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium text-blue-300">Agent Analysis</h4>
                        <p className="text-xs text-blue-200/60">
                            Upload an example to have the agent extract patterns and suggest improvements automatically.
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
