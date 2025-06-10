import React, { useState } from "react";
import axios from "axios";
import Spline from "@splinetool/react-spline";

const App = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateAnswer = async () => {
    if (!question.trim()) return;

    const userMessage = { type: "user", text: question.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuestion("");

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAh_h4H4QulOuo50JyQ2lIOqXYouK9niME",
        method: "post",
        data: {
          contents: [
            {
              role: "user",
              parts: [{ text: `Answer this clearly and helpfully:\n\n${userMessage.text}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        }
      });

      const answer =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No valid answer received.";
      const botMessage = { type: "bot", text: answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "❌ Error fetching response. Check console (F12 > Console) for details."
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="relative flex flex-col h-screen font-sans">

      {/* Spline 3D Background */}
      <div className="absolute inset-0 -z-10">
        <Spline scene="https://prod.spline.design/zGng0NWVH9a9sAVg/scene.splinecode" />
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white p-4 text-center text-3xl font-bold shadow-md backdrop-blur-md">
        MY-AI
      </header>

      {/* Messages */}
      <main className="flex-grow overflow-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-2xl px-4 py-3 rounded-xl shadow-md whitespace-pre-wrap transition duration-300 backdrop-blur-sm ${
              msg.type === "user"
                ? "bg-blue-500/80 text-white self-end ml-auto"
                : "bg-white/80 text-gray-800 self-start mr-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="max-w-2xl px-4 py-3 rounded-xl bg-yellow-100/80 text-yellow-800 self-start mr-auto animate-pulse backdrop-blur-sm">
            Thinking...
          </div>
        )}
      </main>

      {/* Input */}
      <footer className="p-4 bg-white/80 backdrop-blur-md flex items-center gap-2 shadow-inner">
        <textarea
          className="flex-grow border-2 border-purple-400 rounded-lg p-3 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              generateAnswer();
            }
          }}
        />
        <button
          onClick={generateAnswer}
          className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
        >
          Send
        </button>
      </footer>
    </div>
  );
};

export default App;
