/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000";

export function Chat({ userData }) {
  const username = userData.customer.username;
  const { id } = useParams();
  const TICKET_ID = id;
  console.log(TICKET_ID)

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();
  const chatEndRef = useRef(null); // Ref for the end of the chat window

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      extraHeaders: {
        username: username || "mahek",
      },
      withCredentials: true,
    });

    // Listen for connection success
    socketRef.current.on("pairSuccess", (data) => {
      console.log("Connected to socket:", data);
      // Join the room (ticket)
      socketRef.current.emit("customer_join", { ticketId: TICKET_ID });
    });

    // Fetch message history when joined
    socketRef.current.on("message_history", (data) => {
      console.log("message_history", data);
      setMessages((prevMessages) => [...data, ...prevMessages]);
    });

    socketRef.current.on("receive_message", (data) => {
      console.log("receive_message", data.newMessage);
      setMessages((prevMessages) => [...prevMessages, data.newMessage]);
    });

    // Clean up on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [TICKET_ID]); // Add TICKET_ID as a dependency to avoid stale values

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Scroll every time the messages array is updated

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === "") return; // Prevent sending empty messages

    socketRef.current.emit("send_message", {
      content: input, // Use 'input' instead of 'inputMessage'
      ticketId: TICKET_ID,
    });

    // Clear the input after sending
    setInput("");
  };

  return (
    <div className="flex flex-col w-[90%] pt-4 pr-2">
      {/* Chat Window */}
      <div className="flex-grow h-[70vh] p-4 border rounded-lg bg-gray-100 space-y-4 overflow-y-scroll">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "customer" ? "justify-end" : "justify-start"
            }`}
          >
            <div
            >
              <p className={`p-3 rounded-lg max-w-xs ${
                message.sender === "customer"
                  ? "bg-gray-300 text-black" // Customer message in grey
                  : "bg-[#3eabd6] text-white" // Agent message in blue
              }`}>{message.content}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 mr-1">
                  {new Date(message.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false, // 24-hour format
                  })}
                </span>
                <span>{message.sender === "customer" ? message.agentId : message.username}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} /> {/* Empty div to act as a scroll target */}
      </div>

      {/* Input Field */}
      <div className="flex mt-2">
        <input
          type="text"
          className="flex-grow border rounded-lg p-2 mr-2"
          placeholder="Type your message..."
          value={input} // Bind the input value to 'input' state
          onChange={(e) => setInput(e.target.value)} // Update 'input' state on change
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Send on Enter key press
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
