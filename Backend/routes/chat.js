import express from "express";
import crypto from "crypto";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

/* ===========================
   GET ALL THREADS
=========================== */
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({})
      .sort({ updatedAt: -1 })
      .select("threadId title updatedAt");

    res.json(threads);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

/* ===========================
   CREATE NEW THREAD
=========================== */
router.post("/thread", async (req, res) => {
  try {
    const threadId = crypto.randomUUID();

    const newThread = new Thread({
      threadId,
      title: "New Chat",
      messages: [],
    });

    await newThread.save();

    res.json({
      threadId: newThread.threadId,
      title: newThread.title,
      updatedAt: newThread.updatedAt,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create thread" });
  }
});

/* ===========================
   GET CHAT BY THREAD ID
=========================== */
router.get("/chat/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json({ messages: thread.messages });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

/* ===========================
   SEND MESSAGE
=========================== */
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    // user message
    thread.messages.push({ role: "user", content: message });

    // assistant reply
    const assistantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    // auto title (first message only)
    if (thread.title === "New Chat") {
      thread.title = message.slice(0, 30);
    }

    thread.updatedAt = new Date();
    await thread.save();

    res.json({ reply: assistantReply });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/* ===========================
   DELETE THREAD
=========================== */
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deleted = await Thread.findOneAndDelete({ threadId });

    if (!deleted) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

export default router;
