export async function GET() {
  return new Response(
    JSON.stringify({
      name: "Sheep Sorter Game",
      description: "Sort sheep and compete on the Monad blockchain.",
      icon: "https://sheep-sorter-monad.vercel.app/frame-preview.png",
      frame_url: "https://sheep-sorter-monad.vercel.app/api/frame",
      redirect_url: "https://sheep-sorter-monad.vercel.app",
      developer: {
        name: "big-bigbju",
        url: "https://x.com/nas91110"
      }
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
