//app/api/analyze-video/route.ts

import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Replace with your API Key

export async function POST(request) {
  try {
    const { channelUserName } = await request.json();
    // Fetching the list of popular videos for a channel
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${channelUserName}&type=channel&key=${YOUTUBE_API_KEY}`;
    const searchResponse = await fetch(searchUrl);

    if (!searchResponse.ok) {
      throw new Error(
        `Failed to fetch video list. Status: ${searchResponse.status}`
      );
    }

    const searchData = await searchResponse.json();
    if (!searchData.items.length) {
      throw new Error('No videos found for this channel.');
    }

    const channnelData = searchData['items'][0]['snippet'];
    const channelID = channnelData['channelId'];

    // Fetch all videos from the channel
    const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelID}&maxResults=50&order=viewCount&type=video&key=${YOUTUBE_API_KEY}`;
    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();
    if (!videosData.items.length) {
      throw new Error('No videos found for this channel.');
    }

    // Get video statistics for each video
    const videoIds = videosData.items
      .map((video) => video.id.videoId)
      .join(',');
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoIds}&part=statistics&key=${YOUTUBE_API_KEY}`;
    const statsResponse = await fetch(statsUrl);
    const statsData = await statsResponse.json();

    // Combine video details with view count
    const combinedData = videosData.items
      .map((video, index) => {
        console.log(video.snippet, statsData.items[index].statistics);
        return {
          title: video.snippet.title,
          viewCount: statsData.items[index].statistics.viewCount,
          date: video.snippet.publishedAt,
        };
      })
      .sort((a, b) => Number(b.viewCount) - Number(a.viewCount)); // Sort by view count

    const returnData = {
      channelTitle: channnelData['channelTitle'],
      channelThumbnail: channnelData['thumbnails']['medium'],
      videosData: combinedData,
    };

    return NextResponse.json(returnData);
  } catch (error) {
    return NextResponse.json({
      error: true,
    });
  }
}
