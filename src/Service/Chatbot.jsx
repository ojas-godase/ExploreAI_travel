import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! Ask me anything about your trip.", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const aiRes = await axios.post("http://localhost:1000/chat", {
        prompt: input,
      });

      const responseText =
        aiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't fetch a response.";

      setMessages([...newMessages, { text: responseText, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages([
        ...newMessages,
        { text: "Something went wrong. Try again later.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-[24rem] h-[28rem] md:w-[26rem] bg-white shadow-lg rounded-lg border p-4 flex flex-col">
      {/* Chat Title */}
      <h2 className="text-lg font-semibold text-blue-600 text-center">
        Travel AI Chatbot
      </h2>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto border-b pb-2 flex flex-col p-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 my-1 max-w-[75%] rounded-xl text-sm break-words ${
              msg.sender === "bot"
                ? "bg-green-100 text-green-800 self-start"
                : "bg-blue-500 text-white self-end"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="p-3 my-1 bg-green-100 text-green-800 rounded-xl self-start">
            Typing...
          </div>
        )}
      </div>

      {/* Input & Send Button */}
      <div className="flex items-center mt-2">
        <input
          type="text"
          className="flex-1 border rounded-full p-3 text-sm outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
