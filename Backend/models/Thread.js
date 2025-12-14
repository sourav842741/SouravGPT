import mongoose from "mongoose";

/* ===========================
   MESSAGE SCHEMA
=========================== */
const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // 👈 message createdAt auto
    _id: false,
  }
);

/* ===========================
   THREAD SCHEMA
=========================== */
const ThreadSchema = new mongoose.Schema(
  {
    threadId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true, // 👈 createdAt & updatedAt auto
  }
);

export default mongoose.model("Thread", ThreadSchema);
