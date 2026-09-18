export default function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-cache");
  return res.status(200).json({
    status: "ok",
    environment: process.env.VERCEL ? "vercel-serverless" : "standard",
    timestamp: new Date().toISOString(),
  });
}
