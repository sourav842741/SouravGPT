import Chat from "./Chat";
import { MyContext } from "./MyContext";
import { useContext, useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";
import { FiMenu, FiX, FiUser, FiSend } from "react-icons/fi";

function ChatWindow() {
  const {
    prompt, setPrompt,
    reply, setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    showSidebar, setShowSidebar,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setNewChat(false);

    try {
      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, threadId: currThreadId }),
      });
      const data = await res.json();
      setReply(data.reply);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prev => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
      setPrompt("");
    }
  }, [reply]);

  return (
    <main className="flex flex-col h-full bg-zinc-950">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-xl"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? <FiX /> : <FiMenu />}
          </button>
          <span className="font-semibold">SouravGPT</span>
        </div>
        <FiUser />
      </header>

      {/* Chat */}
      <section className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <Chat />
      </section>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center mb-2">
          <ScaleLoader height={16} color="#fff" />
        </div>
      )}

      {/* Input */}
      <div className="border-t border-zinc-800 px-4 py-3">
        <div className="flex items-center bg-zinc-800 rounded-2xl px-4 py-3 gap-2">
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === "Enter" && getReply()}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-zinc-400"
          />
          <button onClick={getReply}>
            <FiSend />
          </button>
        </div>
      </div>
    </main>
  );
}

export default ChatWindow;
