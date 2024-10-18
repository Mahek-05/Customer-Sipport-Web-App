import { usePastTickets } from "@/hooks/pastTickets";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function History() {
  const { pastTickets, data: chatHistory, error } = usePastTickets();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserDataString = localStorage.getItem('UserData');
    if (storedUserDataString) {
      const storedUserData = JSON.parse(storedUserDataString);
      if (storedUserData && storedUserData.customer) {
        setUserData(storedUserData);
      }
    }
  }, []);

  useEffect(() => {
    if (userData && userData.customer) {
      pastTickets({ 
        agentId: null, 
        username: userData.customer.username, 
        status: null, 
        searchText: null
      });
    }
  }, [userData, pastTickets]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-[80vh] w-[40vh] overflow-y-scroll">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold mb-4">Chat History</h2>
        <Link to="/customer">New Chat</Link>
      </div>
      {error && <div className="text-red-500">Error loading chat history: {error.message}</div>}
      <ul className="space-y-2 ">
        {chatHistory.length > 0 ? (
          chatHistory.map((chat) => (
            console.log("Chat ID: ", chat.id);
            console.log("Chat", chat);
            return ( 
              <li key={chat.id} className="flex justify-between border-b pb-2">
              <span>{chat.issueTitle || chat.text}</span>
              <Link to={`/customer/ticket/${chat.id}`} className="text-gray-500">
                View Chat
              </Link>
            </li>
            );
          ))
        ) : (
          <li className="text-gray-500">No chat history found.</li>
        )}
      </ul>
    </div>
  );
}
