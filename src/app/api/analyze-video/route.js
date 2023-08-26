//app/api/analyze-video/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    const { videoData } = await request.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            "These are the comments for a YouTube video called {title}. Help the video's creator improve at their craft by listing the most useful insights you can. Number the list 1., 2., 3.",
        },
        { role: 'user', content: videoData },
      ],
      model: 'gpt-3.5-turbo',
    });

    return NextResponse.json({
      text: completion['choices'][0]['message']['content'],
      mode: 'comments',
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
    });
  }
}
