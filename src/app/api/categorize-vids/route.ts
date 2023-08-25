//app/api/analyze-video/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

function capitalizeFirstLetterOfEachWord(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export async function POST(request: Request) {
  try {
    const { videoData, secondaryInput } = await request.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let categoryNames;
    if (secondaryInput == '') {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `If these videos were to be seperated into 5 groups based on the general topic they covered, what would you name those groups? Only return the list of category names.`,
          },
          { role: 'user', content: JSON.stringify(videoData) },
        ],
        model: 'gpt-3.5-turbo',
      });
      categoryNames = completion['choices'][0]['message']['content'];
    } else {
      categoryNames = capitalizeFirstLetterOfEachWord(secondaryInput);
    }
    for (let video of videoData) {
      const title = video.title;

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `Use only these categories: ${categoryNames}. What category from this list is the provided text most closely related to? Return only the category name`,
          },
          { role: 'user', content: title },
        ],
        model: 'gpt-3.5-turbo',
      });

      // Add the resulting content to a new key "category" in the video object
      video.category = completion['choices'][0]['message']['content'];
    }
    console.log(videoData, categoryNames, 'videoData');

    return NextResponse.json({
      text: videoData,
      categoryNames: categoryNames,
      mode: 'categorize-vids',
    });
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    throw new Error(`Failed to fetch video list. Status: ${error}`);
  }
}
