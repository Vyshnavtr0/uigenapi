import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    // Parse the request body
    const { html = '' } = await req.json();

    // Generate the image response
    return new ImageResponse(
      // Simple wrapper div to render HTML
      (
        <div 
          style={{
            display: 'flex',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
          }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(`Error generating image: ${error.message}`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}