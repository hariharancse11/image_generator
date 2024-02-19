export default function handler(req, res) {
  const apiKey = process.env.API_KEY;
  res.status(200).json({ apiKey });
}
