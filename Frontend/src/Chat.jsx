import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (!reply || !prevChats.length) {
      setLatestReply(null);
      return;
    }

    const words = reply.split(" ");
    let i = 0;

    const interval = setInterval(() => {
      setLatestReply(words.slice(0, i + 1).join(" "));
      i++;
      if (i >= words.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [reply]);

  return (
    <div className="space-y-4">
      {newChat && (
        <h1 className="text-center text-zinc-500 mt-20">
          👋 Start a new chat
        </h1>
      )}

      {prevChats.slice(0, -1).map((chat, idx) => (
        <div
          key={idx}
          className={`flex ${
            chat.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm
            ${
              chat.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-zinc-800 text-white prose prose-invert"
            }`}
          >
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {chat.content}
            </ReactMarkdown>
          </div>
        </div>
      ))}

      {prevChats.length > 0 && (
        <div className="flex justify-start">
          <div className="max-w-[80%] px-4 py-3 rounded-2xl text-sm bg-zinc-800 prose prose-invert">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {latestReply ?? prevChats.at(-1).content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
