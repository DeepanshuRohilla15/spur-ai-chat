import OpenAI from "openai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const openaiApiKey = process.env.OPENAI_API_KEY;

const client = openaiApiKey
  ? new OpenAI({ apiKey: openaiApiKey })
  : null;

const SYSTEM_PROMPT = `
You are a helpful support agent for a small e-commerce store.

Store Policies:
- Shipping: We ship worldwide. Orders arrive in 5–7 business days.
- Returns: 30-day hassle-free returns.
- Refunds: Processed within 5 business days.
- Support hours: Mon–Fri, 9am–6pm IST.

Answer clearly, concisely, and politely.
If you do not know the answer, say so honestly.
`;

export async function generateReply(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  // ✅ Graceful fallback if API key is missing
  if (!client) {
    return mockReply(userMessage);
  }

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history,
        { role: "user", content: userMessage },
      ],
    });

    return (
      response.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response."
    );
  } catch (error) {
    console.error("LLM error:", error);
    return "Sorry, I'm having trouble right now. Please try again later.";
  }
}

/**
 * Deterministic mock fallback
 * Used when OPENAI_API_KEY is not set
 */
function mockReply(message: string): string {
  const text = message.toLowerCase();

  if (text.includes("ship")) {
    return "Yes, we ship worldwide. Orders usually arrive within 5–7 business days.";
  }

  if (text.includes("return")) {
    return "We offer a 30-day hassle-free return policy for unused items.";
  }

  if (text.includes("refund")) {
    return "Refunds are processed within 5 business days after we receive the returned item.";
  }

  if (text.includes("support")) {
    return "Our support hours are Monday to Friday, 9am to 6pm IST.";
  }

  return "Thanks for your message! Our support team will be happy to assist you.";
}
