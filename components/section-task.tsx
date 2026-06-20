"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Textarea } from "./ui/textarea"
import { useI18n } from "@/lib/i18n/context"

interface SectionTaskProps {
    task: string
    onTaskChange: (value: string) => void
}

export function SectionTask({ task, onTaskChange }: SectionTaskProps) {
    const { t } = useI18n()

    return (
        <Card className="border-t-0 pt-0">
            <CardHeader>
                <CardTitle className="text-[1.5rem] leading-none text-blue-400">{t("task.title")}</CardTitle>
                <CardDescription className="pb-4">
                    {t("task.description")}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder={t("task.placeholder")}
                    className="min-h-[120px] focus-visible:ring-primary/50"
                    value={task}
                    onChange={(e) => onTaskChange(e.target.value)}
                />
            </CardContent>
        </Card>
    )
}
