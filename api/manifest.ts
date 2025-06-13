export async function GET() {
  return new Response(
    JSON.stringify({
      name: "Sheep Sorter Game",
      description: "Sort sheep and compete on the blockchain.",
      icon: "https://sheep-sorter-monad.vercel.app/frame-preview.png",
      frame_url: "https://sheep-sorter-monad.vercel.app/api/frame",
      post_url: "https://sheep-sorter-monad.vercel.app/api/submit",
      developer: {
        name: "big-bigbju",
        url: "https://x.com/nas91110"
      },
      redirect_url: "https://sheep-sorter-monad.vercel.app"
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
