# Spur AI Chat - Mini AI Support Agent

A simple AI-powered chat widget simulating a customer support agent for a small e-commerce store. Built as a take-home assignment for Spur.

## Table of Contents

- Features  
- Tech Stack  
- Setup & Run Locally  
- Architecture Overview  
- LLM Integration Notes  
- Trade-offs & Future Improvements  

## Features

- Web-based live chat interface  
- AI responds using LLM (OpenAI GPT-4 / Claude optional)  
- Conversation persistence with PostgreSQL / SQLite  
- Session-based chat history  
- Typing indicator & input validation  
- Responsive UI with clear distinction between user and AI messages  

## Tech Stack

- Backend: Node.js, TypeScript, Express, Prisma ORM  
- Database: PostgreSQL (or SQLite for development)  
- Frontend: React (functional components + hooks)  
- LLM: OpenAI GPT / Claude (via API)  
- Other: UUID for conversation IDs, Fetch API for frontend-backend communication  

## Setup & Run Locally

1. Clone the repository:
git clone ->
cd spur-ai-chat


2. Install backend dependencies:
cd backend ->
npm install


3. Configure Environment Variables:
Create a `.env` file in the `backend` folder:
DATABASE_URL="sqlite:./dev.db"  or PostgreSQL URL
OPENAI_API_KEY="your_openai_api_key_here",
PORT=3000


4. Prisma Setup (Database):
npx prisma generate -> 
npx prisma migrate dev --name init

5. Run the backend:
npm run dev

6. Frontend Setup:
cd frontend -> npm install -> npm start

## Architecture Overview

### Backend

- **app.ts** – Express app with API routes  
- **server.ts** – Entry point to start the server  
- **services/chat.service.ts** – Conversation & message persistence logic  
- **services/llm.service.ts** – Encapsulates LLM calls  
- **db/prisma.ts** – Prisma client instance  
- **controllers/chat.controller.ts** – API handlers for `/chat/message` and `/chat/:sessionId`  

### Frontend

- **Chat.tsx** – Chat widget with React hooks  
- **Chat.css** – UI styling  
- Fetch API used to communicate with backend  

### Design Decisions

- Conversation persistence via Prisma for easy switching between SQLite/Postgres  
- LLM call wrapped in a service for flexibility (OpenAI / Claude)  
- Input validation and error handling implemented for robustness  
- Frontend stores `sessionId` in `localStorage` for chat persistence  

## LLM Integration Notes

- **Provider used:** OpenAI GPT-4 (gpt-4-32k recommended)  
- **Prompt design:**  

System prompt:  
You are a helpful support agent for a small e-commerce store.  

**Store Policies:**  
- Shipping: We ship worldwide. Orders arrive in 5–7 business days.  
- Returns: 30-day hassle-free returns.  
- Refunds: Processed within 5 business days.  
- Support hours: Mon–Fri, 9am–6pm IST.  

Answer clearly and concisely.  

- **Conversation context:** Entire previous chat messages included in LLM call  
- **Error Handling:** API errors, timeouts, invalid key handled gracefully  

## Trade-offs & "If I Had More Time…"

### Trade-offs

- No authentication  
- Simple conversation history (no pagination)  
- Basic UI without a full design system  
- Max tokens capped to control API costs  

### Future Improvements

- Persistent multi-device chat sessions  
- WhatsApp / Instagram / Facebook channel integration  
- Rich message types (images, buttons, links)  
- Enhanced UI/UX with animations, emoji support, responsiveness  
- Rate-limiting and caching for LLM responses  




