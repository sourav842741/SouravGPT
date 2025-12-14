import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import { MyContext } from "./MyContext";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <MyContext.Provider
      value={{
        prompt, setPrompt,
        reply, setReply,
        currThreadId, setCurrThreadId,
        prevChats, setPrevChats,
        newChat, setNewChat,
        allThreads, setAllThreads,
        showSidebar, setShowSidebar,
      }}
    >
      <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <ChatWindow />
        </div>
      </div>
    </MyContext.Provider>
  );
}

export default App;
