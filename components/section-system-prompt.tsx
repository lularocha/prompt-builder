import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Textarea } from "./ui/textarea";

interface SectionSystemPromptProps {
  constraints: string;
  onConstraintsChange: (value: string) => void;
}

export function SectionSystemPrompt({
  constraints,
  onConstraintsChange,
}: SectionSystemPromptProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[1.5rem] pb-4">1. System Prompt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Behavior & Constraints */}
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <h4 className="text-xl font-bold text-blue-400">
              Behavior & Constraints
            </h4>
            <span className="block text-sm text-muted-foreground">
              Define behavioral rules, quality standards, things to always/never
              do.
            </span>
          </div>
          <Textarea
            placeholder={`Examples:\n- Prioritize readability and accessibility\n- Handle errors gracefully\n- Follow WCAG 2.1 AA standards`}
            className="min-h-[100px] focus-visible:ring-primary/50"
            value={constraints}
            onChange={(e) => onConstraintsChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
