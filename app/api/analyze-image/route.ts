import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

interface VisualContextSuggestions {
    persona: string[]
    constraints: string[]
    task: string[]
    requirements: string[]
    tech: string[]
}

export async function POST(request: NextRequest) {
    try {
        const { image, mediaType } = await request.json()

        if (!image) {
            return NextResponse.json(
                { error: 'No image provided' },
                { status: 400 }
            )
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            )
        }

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image',
                            source: {
                                type: 'base64',
                                media_type: mediaType || 'image/png',
                                data: image,
                            },
                        },
                        {
                            type: 'text',
                            text: `Analyze this design screenshot or wireframe. Extract patterns and provide suggestions for building a prompt about this design.

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "persona": ["suggestion 1", "suggestion 2"],
  "constraints": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "task": ["suggestion 1", "suggestion 2"],
  "requirements": ["suggestion 1", "suggestion 2", "suggestion 3", "suggestion 4", "suggestion 5"],
  "tech": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Guidelines:
- persona: 2 suggestions for the ideal developer profile/expertise (e.g., "Senior frontend developer with React and data visualization experience", "UI/UX focused developer experienced with dashboard design")
- constraints: 3 suggestions for behavioral rules or quality standards (e.g., "Follow accessibility standards for data-heavy interfaces", "Ensure responsive design across all breakpoints", "Use semantic HTML elements throughout")
- task: 2 suggestions describing what is being built (e.g., "Build a real-time analytics dashboard", "Create an e-commerce product listing page with filters")
- requirements: 5 suggestions for functional specifications:
  - 2 describing specific features visible in the design (e.g., "Display metrics in card grid layout", "Include date range picker for data filtering")
  - 1 describing the visual style/look and feel (e.g., "Modern minimalist design with subtle shadows", "Dark theme with accent color highlights")
  - 1 describing layout patterns observed (e.g., "Sidebar navigation with main content area", "Full-width hero section with grid below")
  - 1 describing interactions or behavior (e.g., "Hover states on interactive elements", "Smooth transitions between view states")
- tech: 3 specific technologies visible or recommended (e.g., "React", "Tailwind CSS", "Chart.js")

Keep suggestions concise (under 80 characters each). Focus on what you actually see in the image.`,
                        },
                    ],
                },
            ],
        })

        const textContent = response.content.find(block => block.type === 'text')
        if (!textContent || textContent.type !== 'text') {
            throw new Error('No text response from Claude')
        }

        const suggestions: VisualContextSuggestions = JSON.parse(textContent.text)

        return NextResponse.json(suggestions)
    } catch (error) {
        console.error('Image analysis error:', error)

        const errorMessage = error instanceof Error ? error.message : 'Unknown error'

        return NextResponse.json(
            { error: `Analysis failed: ${errorMessage}` },
            { status: 500 }
        )
    }
}
