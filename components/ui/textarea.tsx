import * as React from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, value, placeholder, ...props }, ref) => {
        const internalRef = React.useRef<HTMLTextAreaElement>(null)

        // Merge refs
        React.useImperativeHandle(ref, () => internalRef.current!)

        // Auto-resize function
        const adjustHeight = React.useCallback(() => {
            const element = internalRef.current
            if (!element) return

            // Reset height to auto to get the correct scrollHeight
            element.style.height = 'auto'

            // Calculate minimum height based on placeholder if value is empty
            if (!value && placeholder) {
                const lineCount = placeholder.split('\n').length
                const lineHeight = 20 // approximate line height in pixels
                const padding = 16 // py-2 = 8px top + 8px bottom
                const minHeight = Math.max(80, lineCount * lineHeight + padding)
                element.style.height = `${Math.max(element.scrollHeight, minHeight)}px`
            } else {
                element.style.height = `${element.scrollHeight}px`
            }
        }, [value, placeholder])

        // Adjust on mount and when value/placeholder changes
        React.useEffect(() => {
            adjustHeight()
        }, [adjustHeight])

        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-md bg-[#1e1e23] px-4 pt-3 pb-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset disabled:cursor-not-allowed disabled:opacity-50 overflow-hidden resize-none",
                    className
                )}
                ref={internalRef}
                value={value}
                placeholder={placeholder}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"

export { Textarea }
