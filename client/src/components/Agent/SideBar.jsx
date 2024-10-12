import { usePastTickets } from "@/hooks/pastTickets";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AgentHistory() {
  const { pastTickets, data: chatHistory = [], error } = usePastTickets();
  const [userData, setUserData] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUserDataString = localStorage.getItem('UserData');
    if (storedUserDataString) {
      const storedUserData = JSON.parse(storedUserDataString);
      if (storedUserData && storedUserData.agent) {
        setUserData(storedUserData);
      }
    }
  }, []); // Runs only once on mount

  // Fetch tickets when userData is available
  useEffect(() => {
    if (userData && userData.agent) {
      pastTickets({
        agentId: userData.agent.agentId, 
        username: null,
        status: null,
        searchText: null, 
      });
    }
  }, [userData, pastTickets]); // Runs when userData changes

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-[80vh] w-[30vw] overflow-y-scroll">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold mb-4">Agent Chat History</h2>
        <Link to="/agent">New Chat</Link>
      </div>

      {error && <div className="text-red-500">Error loading chat history: {error.message}</div>}

      <ul className="space-y-2">
        {chatHistory.length > 0 ? (
          chatHistory.map((chat) => {
            console.log(chat)
            return (
              <li key={chat.id} className="flex justify-between border-b pb-2">
                <span>{chat.issueTitle || chat.text}</span>
                <Link to={`/agent/ticket/${chat._id}`} className="text-gray-500">
                  View Chat
                </Link>
              </li>
            );
          })
        ) : (
          <li className="text-gray-500">No chat history found.</li>
        )}
      </ul>
    </div>
  );
}
