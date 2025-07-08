// api/getAdvice.js

import { Configuration, OpenAIApi } from "openai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your Vercel project environment variables
});

const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { industry, size, goals, struggleArea, details } = req.body;

  if (!industry || !size || !goals || !struggleArea || !details) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const prompt = `
You are an AI business consultant. Provide smart, helpful, and practical advice.

Business info:
- Industry: ${industry}
- Size: ${size} employees
- Goals: ${goals}
- Struggles: ${struggleArea}
- Details: ${details}

Give clear, specific suggestions they can act on today.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4o", // You can change this to "gpt-4" or "gpt-3.5-turbo" if needed
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    });

    const advice = completion.data.choices[0].message.content.trim();

    res.status(200).json({ advice });
  } catch (error) {
    console.error("OpenAI error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch AI advice" });
  }
}
