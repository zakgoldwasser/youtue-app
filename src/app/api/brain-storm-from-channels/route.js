//app/api/analyze-video/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
  try {
    const { videoData, secondaryInput, channelUserName } = await request.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let promptString;
    if (secondaryInput != '') {
      promptString = `This is a list of titles for the channel ${channelUserName}. Use these titles to create a long thorough list of title examples and a list of fill-in-the-blank templates to make a ${channelUserName} style video about ${secondaryInput}`;
    } else {
      promptString =
        'Based on the provided list of titles, assist this creator in brainstorming new videos. Provide a long thorough list of topic suggestions, a long thorough list of title examples and a long thorough list of fill-in-the-blank templates the creator can use to create their next video';
    }
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: promptString,
        },
        { role: 'user', content: 'Titles: ' + JSON.stringify(videoData) },
      ],
      model: 'gpt-3.5-turbo',
    });

    return NextResponse.json({
      text: completion['choices'][0]['message']['content'],
      mode: 'brain-storm-from-channels',
    });
  } catch (error) {
    return NextResponse.json({
      error: true,
    });
  }
}
