export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  return new Response(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://sheep-sorter.vercel.app/public/frame-preview.jpg" />
        <meta property="fc:frame:button:1" content="Play Game" />
        <meta property="fc:frame:post_url" content="https://sheep-sorter.vercel.app" />
      </head>
      <body></body>
    </html>
    `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  );
}
