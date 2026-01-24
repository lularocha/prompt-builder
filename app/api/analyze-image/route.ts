import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

interface VisualContextSuggestions {
    context: string[]
    persona: string[]
    techStack: string[]
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
  "context": ["suggestion 1", "suggestion 2"],
  "persona": ["suggestion 1", "suggestion 2"],
  "techStack": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Guidelines:
- context: 2 suggestions describing what is being built (e.g., "Building a dashboard with data cards", "E-commerce product listing page")
- persona: 2 suggestions for the ideal developer profile (e.g., "Frontend developer experienced with React", "UI/UX focused developer")
- techStack: 2-3 specific technologies visible or recommended (e.g., "React", "Tailwind CSS", "Chart.js")

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
