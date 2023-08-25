// pages/api/comments.js
export default async function POST(req, res) {
  const placeholderApiUrl =
    'https://rtu4mbtpm5.execute-api.us-east-1.amazonaws.com/prod/retrieve-and-analyze';

  try {
    const response = await fetch(placeholderApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ videoId: videoId }),
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to post videoId. Status: ${response.status}`);
    }
    const resultData = await response.json();
    return resultData;
  } catch (error) {
    console.error('Error posting videoId:', error);
  }
}
