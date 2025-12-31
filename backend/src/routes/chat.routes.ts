import { Router } from "express";
import { postChatMessage } from "../controllers/chat.controller";
import { getChatHistory } from "../controllers/chat.controller";

const router = Router();

router.post("/message", postChatMessage);
router.get("/:sessionId", getChatHistory);

export default router;