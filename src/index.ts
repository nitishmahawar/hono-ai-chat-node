import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { streamText, type Message } from "ai";
import { groq } from "@ai-sdk/groq";
import "dotenv/config";

const app = new Hono();

const model = groq("llama-3.1-70b-versatile");

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/chat", async (c) => {
  try {
    const { messages }: { messages: Message[] } = await c.req.json();

    const stream = streamText({
      model,
      messages,
    });
    return stream.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
