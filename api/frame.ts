export async function GET(request) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="Sheep Sorter Game 🐑" />
        <meta property="og:image" content="https://sheep-sorter-monad.vercel.app/og-image.png" />
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:frame:image" content="https://sheep-sorter-monad.vercel.app/og-image.png" />
        <meta name="fc:frame:button:1" content="Play Now" />
        <meta name="fc:frame:button:1:action" content="link" />
        <meta name="fc:frame:button:1:target" content="https://sheep-sorter-monad.vercel.app/" />
      </head>
      <body></body>
    </html>
  `;
  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}
