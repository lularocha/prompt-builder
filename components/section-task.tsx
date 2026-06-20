import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"

interface SectionTaskProps {
    task: string
    onTaskChange: (value: string) => void
}

export function SectionTask({ task, onTaskChange }: SectionTaskProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-[1.5rem]">What do you want to build?</CardTitle>
                <CardDescription className="pb-4">
                    Describe your project, feature, or task. AI will write the prompt for you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder="Example: Build a responsive admin dashboard for a SaaS platform with real-time analytics, user management, and dark mode."
                    className="min-h-[120px] focus-visible:ring-primary/50"
                    value={task}
                    onChange={(e) => onTaskChange(e.target.value)}
                />
            </CardContent>
        </Card>
    )
}
