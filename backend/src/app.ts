import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/chat", chatRoutes);

export default app;
