import { Request, Response } from "express";
import { Sender } from "@prisma/client";
import {
  getOrCreateConversation,
  saveMessage,
  getConversationMessages,
} from "../services/chat.service";
import { generateReply } from "../services/llm.service";


export async function postChatMessage(req: Request, res: Response) {
  try {
    const { message, sessionId } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message must be a non-empty string",
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        error: "Message is too long (max 2000 characters)",
      });
    }

    const cleanMessage = message.trim();

    // 1. Get or create conversation
    const conversation = await getOrCreateConversation(sessionId);

    // 2. Save user message
    await saveMessage(conversation.id, Sender.user, cleanMessage);

    // 3. Fetch history
    const history = await getConversationMessages(conversation.id);

    // 4. Format for LLM
    const formattedHistory: { role: "user" | "assistant"; content: string }[] =
  history.map((msg) => ({
    role: msg.sender === Sender.user ? "user" : "assistant",
    content: msg.text,
  }));


    // 5. Generate AI reply
    const aiReply = await generateReply(formattedHistory, cleanMessage);

    // 6. Save AI reply
    await saveMessage(conversation.id, Sender.ai, aiReply);

    return res.status(200).json({
      reply: aiReply,
      sessionId: conversation.id,
    });
  } catch (error) {
    console.error("POST /chat/message error:", error);

    return res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
}

/**
 * GET /chat/:sessionId
 */
export async function getChatHistory(req: Request, res: Response) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        error: "sessionId is required",
      });
    }

    const messages = await getConversationMessages(sessionId);

    return res.status(200).json({
      sessionId,
      messages,
    });
  } catch (error) {
    console.error("GET /chat/:sessionId error:", error);

    return res.status(500).json({
      error: "Could not fetch conversation history",
    });
  }
}
