import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import { SiOpenai } from "react-icons/si";

function Sidebar() {
  const {
    allThreads, setAllThreads,
    currThreadId, setCurrThreadId,
    setPrevChats,
    setNewChat,
    setPrompt,
    setReply,
    showSidebar, setShowSidebar,
  } = useContext(MyContext);

  // 🔹 Load all threads
  const getAllThreads = async () => {
    const res = await fetch("http://localhost:8080/api/thread");
    const data = await res.json();
    setAllThreads(data);
  };

  useEffect(() => {
    getAllThreads();
  }, []);

  // 🔹 Load chat history
  const loadChatHistory = async (threadId) => {
    setCurrThreadId(threadId);
    setNewChat(false);
    setPrompt("");
    setReply(null);

    const res = await fetch(`http://localhost:8080/api/chat/${threadId}`);
    const data = await res.json();

    setPrevChats(data.messages);
    setShowSidebar(false);
  };

  // 🔹 Create new chat
  const createNewChat = async () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setPrevChats([]);

    const res = await fetch("http://localhost:8080/api/thread", {
      method: "POST",
    });

    const newThread = await res.json();

    setCurrThreadId(newThread.threadId);
    setAllThreads(prev => [newThread, ...prev]);
    setShowSidebar(false);
  };

  // 🔹 Delete chat
  const deleteChat = async (e, threadId) => {
    e.stopPropagation();

    await fetch(`http://localhost:8080/api/thread/${threadId}`, {
      method: "DELETE",
    });

    setAllThreads(prev => prev.filter(t => t.threadId !== threadId));

    if (threadId === currThreadId) {
      createNewChat();
    }
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900
      transform transition-transform duration-300
      ${showSidebar ? "translate-x-0" : "-translate-x-full"}
      lg:static lg:translate-x-0 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <SiOpenai className="text-2xl text-green-400" />
          <span className="font-semibold text-sm">SouravGPT</span>
        </div>
        <button className="lg:hidden" onClick={() => setShowSidebar(false)}>
          <FiX />
        </button>
      </div>

      {/* New Chat */}
      <button
        onClick={createNewChat}
        className="mx-4 mt-4 flex items-center gap-2 px-3 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-sm"
      >
        <FiEdit /> New Chat
      </button>

      {/* Threads */}
      <ul className="flex-1 mt-4 px-2 space-y-1 overflow-y-auto">
        {allThreads.map(thread => (
          <li
            key={thread.threadId}
            onClick={() => loadChatHistory(thread.threadId)}
            className={`group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer
            ${currThreadId === thread.threadId
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-white"}`}
          >
            <span className="truncate">{thread.title}</span>
            <FiTrash2
              onClick={(e) => deleteChat(e, thread.threadId)}
              className="text-red-400 opacity-0 group-hover:opacity-100"
            />
          </li>
        ))}
      </ul>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-zinc-800 text-center text-xs text-zinc-500">
        Created by <span className="text-white">Sourav Kumar</span> ❤️
      </div>
    </aside>
  );
}

export default Sidebar;
