import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"

interface SectionUserPromptProps {
    task: string
    onTaskChange: (value: string) => void
    requirements: string
    onRequirementsChange: (value: string) => void
    tech: string
    onTechChange: (value: string) => void
}

export function SectionUserPrompt({
    task,
    onTaskChange,
    requirements,
    onRequirementsChange,
    tech,
    onTechChange
}: SectionUserPromptProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-[1.5rem] pb-4">2. User Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Task */}
                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-xl font-bold text-blue-400">Task</h4>
                        <span className="block text-sm text-muted-foreground">Tell AI what you want to build.</span>
                    </div>
                    <Textarea
                        placeholder="Example: Build a responsive admin dashboard for a SaaS platform..."
                        className="min-h-[100px]  focus-visible:ring-primary/50"
                        value={task}
                        onChange={(e) => onTaskChange(e.target.value)}
                    />
                </div>

                {/* Requirements */}
                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-xl font-bold text-blue-400">Requirements</h4>
                        <span className="block text-sm text-muted-foreground">List functional specifications, features, and behavior.</span>
                    </div>
                    <Textarea
                        placeholder={`Examples:\n- Display real-time analytics\n- User authentication with role-based access\n- Dark mode support`}
                        className="min-h-[100px]  focus-visible:ring-primary/50"
                        value={requirements}
                        onChange={(e) => onRequirementsChange(e.target.value)}
                    />
                </div>

                {/* Tech */}
                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-xl font-bold text-blue-400">Tech</h4>
                        <span className="block text-sm text-muted-foreground">List stack, frameworks, libraries, APIs.</span>
                    </div>
                    <Textarea
                        placeholder={`Examples:\n- React, Next.js\n- Tailwind CSS\n- Prisma, PostgreSQL`}
                        className="min-h-[100px]  focus-visible:ring-primary/50"
                        value={tech}
                        onChange={(e) => onTechChange(e.target.value)}
                    />
                </div>

            </CardContent>
        </Card>
    )
}
