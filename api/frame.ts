// export async function GET(request) {
//   const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta property="og:title" content="Sheep Sorter Game 🐑" />
//         <meta property="og:image" content="https://sheep-sorter-monad.vercel.app/og-image.png" />
//         <meta name="fc:frame" content="vNext" />
//         <meta name="fc:frame:image" content="https://sheep-sorter-monad.vercel.app/og-image.png" />
//         <meta name="fc:frame:button:1" content="Play Now" />
//         <meta name="fc:frame:button:1:action" content="link" />
//         <meta name="fc:frame:button:1:target" content="https://sheep-sorter-monad.vercel.app/" />
//       </head>
//       <body></body>
//     </html>
//   `;
//   return new Response(html, {
//     headers: { "Content-Type": "text/html" },
//   });
// }

export async function GET() {
  return new Response(
    `<html>
      <head><title>Sheep Sorter Game</title></head>
      <body style="display:flex;align-items:center;justify-content:center;height:100vh;">
        <h1>🐑 Sheep Sorter Game is Live!</h1>
      </body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}