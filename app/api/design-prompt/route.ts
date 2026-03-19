import { NextRequest, NextResponse } from 'next/server';

type DesignPromptRequestBody = {
  websiteType: string;
  audience: string;
  style: string;
  colors: string;
  features: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DesignPromptRequestBody;

    const { websiteType, audience, style, colors, features } = body;

    if (!websiteType || !websiteType.trim()) {
      return NextResponse.json(
        { error: 'Missing required field: websiteType' },
        { status: 400 }
      );
    }

    const system = `
You are an expert UI/UX designer and creative director who specializes in writing highly detailed, actionable website design prompts.

Your task: Generate a single, comprehensive website design prompt that a designer or AI design tool (like Midjourney, Stable Diffusion, or Figma AI) can use directly to create a stunning website layout.

The prompt must include:
1. Overall visual style and mood
2. Color palette with specific hex codes where appropriate
3. Typography suggestions (font families, weights, hierarchy)
4. Layout structure (hero, sections, navigation, footer)
5. UI component details (buttons, cards, forms, icons)
6. Imagery and illustration style
7. Spacing, whitespace philosophy
8. Any animations or micro-interactions to mention
9. Accessibility and responsiveness notes

Format your response as a single, well-structured prompt block that starts with "Design a [type] website..." and flows as one cohesive description. Keep it detailed but readable—around 250–400 words.
`.trim();

    const userRequest = `
Website type / purpose: ${websiteType}
Target audience: ${audience || 'general users'}
Visual style preference: ${style || 'modern and clean'}
Color preferences: ${colors || 'no strong preference'}
Key sections or features: ${features || 'standard sections'}

Generate the website design prompt now.
`.trim();

    const prompt = `${system}

${userRequest}`;

    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:latest',
        prompt,
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      const text = await ollamaRes.text();
      console.error('Ollama error:', text);
      return NextResponse.json(
        { error: 'Failed to reach local model' },
        { status: 500 }
      );
    }

    const ollamaJson = (await ollamaRes.json()) as { response?: string };
    const generatedPrompt = ollamaJson.response ?? '';

    return NextResponse.json({ generatedPrompt });
  } catch (err) {
    console.error('Design prompt API error:', err);
    return NextResponse.json(
      { error: 'Unexpected error in design-prompt API' },
      { status: 500 }
    );
  }
}
