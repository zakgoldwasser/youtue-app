//app/api/analyze-video/route.ts

import { NextResponse } from 'next/server';
// Replace with your API Key

export async function POST(request) {
  return NextResponse.json({ message: process.env.YOUTUBE_API_KEY });
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

  if (!YOUTUBE_API_KEYk) return NextResponse.json({ message: 'No API key' });
  try {
    const { videoId } = await request.json();

    let allComments = [];
    let nextPageToken;
    let title, thumbnail_url;

    // Fetching video details to get title and thumbnail URL
    const videoDetailUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const videoDetailResponse = await fetch(videoDetailUrl);

    if (!videoDetailResponse.ok) {
      throw new Error(
        `Failed to fetch video details. Status: ${videoDetailResponse.status}`
      );
    }
    const videoData = await videoDetailResponse.json();
    if (videoData.items.length) {
      title = videoData.items[0].snippet.title;
      thumbnail_url = videoData.items[0].snippet.thumbnails.medium.url; // You can also use `medium` or `high` based on the resolution you want
    } else {
      throw new Error('Video not found.');
    }

    const youtubeUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=50&key=${YOUTUBE_API_KEY}${
      nextPageToken ? `&pageToken=${nextPageToken}` : ''
    }`;

    const apiResponse = await fetch(youtubeUrl);

    if (!apiResponse.ok) {
      throw new Error(
        `Failed to fetch comments. Status: ${apiResponse.status}`
      );
    }

    const data = await apiResponse.json();
    allComments = allComments.concat(
      data.items.map(
        (item) => item.snippet.topLevelComment.snippet.textOriginal
      )
    );
    nextPageToken = data.nextPageToken;

    return NextResponse.json({
      title: title,
      thumbnail_url: thumbnail_url,
      commentsData: allComments.join(' '),
    });
  } catch (error) {
    console.error('Error fetching YouTube comments:', error);
    // return NextResponse.error({ status: 500, statusText: 'Internal Server Error' });
  }
}
