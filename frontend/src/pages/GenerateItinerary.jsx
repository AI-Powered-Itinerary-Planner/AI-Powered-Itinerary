import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import "./GenerateItinerary.css";
import { useNavigate } from "react-router-dom";

const extractJsonFromMarkdown = (text) => {
    const fenced = text.match(/```json\s*([\s\S]*?)```/);
    if (fenced && fenced[1]) {
      try {
        return JSON.parse(fenced[1]);
      } catch (e) {
        console.error("JSON fenced parsing failed", e);
      }
    }
  
    // Fallback: try to extract raw object (e.g., starts with '{')
    const braceMatch = text.match(/{[\s\S]*}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch (e) {
        console.error("Raw JSON parsing failed", e);
      }
    }
  
    return null;
};

const GenerateItinerary = () => {
  const [itineraryData, setItineraryData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedChat = localStorage.getItem("chatHistory");
    if (savedChat) {
      const parsedChat = JSON.parse(savedChat);
      setMessages(parsedChat);

      const firstAssistantReply = parsedChat.find((msg) => msg.role === "assistant");
      if (firstAssistantReply) {
        const extracted = extractJsonFromMarkdown(firstAssistantReply.content);
        if (extracted?.itinerary) setItineraryData(extracted.itinerary);
      }
    } else {
      const initial = localStorage.getItem("generatedItinerary");
      if (initial) {
        const extracted = extractJsonFromMarkdown(initial);
        if (extracted?.itinerary) setItineraryData(extracted.itinerary);
        setMessages([{ role: "assistant", content: initial }]);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
  
    const prompt = localStorage.getItem("prompt");
    console.log(prompt);
  
    const baseMessages = [
      { role: "user", content: prompt },
    ];
  
    const updatedMessages = [...baseMessages, ...messages, { role: "user", content: userInput }];
    setUserInput("");
    setIsThinking(true);
  
    fetch("http://localhost:3001/itineraries/converse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages })
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: userInput },
          { role: "assistant", content: data.reply }
        ]);
  
        const extracted = extractJsonFromMarkdown(data.reply);
        if (extracted?.itinerary) setItineraryData(prev => [...prev, extracted.itinerary]);
      })
      .finally(() => setIsThinking(false));
  };

  const handleBack = () => {
    localStorage.removeItem("chatHistory");
    localStorage.removeItem("generatedItinerary");
    navigate("/plantrip");
  };

  return (
    <div className="itinerary-page">
      <h1 className="heading">Your Itinerary</h1>

      <motion.div
        className="itinerary-box"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {itineraryData.map((day, idx) => (
          <div key={idx} className="day-card">
            <h2>Day {day.day}: {day.title}</h2>
            <ul className="activity-list">
              {day.activities.map((act, i) => (
                <li key={i} className="activity-item">
                  <span className="activity-time">{act.time}</span>
                  <p className="activity-desc">{act.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {messages.length > 1 && (
          <div className="chat-box">
            {messages.slice(1).map((msg, idx) => {
  const parsedJson = extractJsonFromMarkdown(msg.content);
  const isJson = msg.role === "assistant" && parsedJson;

  return (
    <div key={idx}>
      <div className={`chat-message ${msg.role}`}>
        {!isJson ? <pre>{msg.content}</pre> : <p>✅ Here's your updated itinerary:</p>}
      </div>

      {isJson && parsedJson.itinerary && (
        <div className="versioned-itinerary">
          {parsedJson.itinerary.map((day, dIdx) => (
            <div key={dIdx} className="day-card">
              <h2>Day {day.day}: {day.title}</h2>
              <ul className="activity-list">
                {day.activities.map((act, aIdx) => (
                  <li key={aIdx} className="activity-item">
                    <span className="activity-time">{act.time}</span>
                    <p className="activity-desc">{act.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
})}
            <div ref={bottomRef} />
          </div>
        )}

        <form onSubmit={handleSend} className="chat-input-wrapper">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask something like 'Make it romantic...'"
          />
          <button type="submit" disabled={isThinking}>
            {isThinking ? "..." : "Send"}
          </button>
        </form>
      </motion.div>

      <motion.button
        className="back-btn"
        whileHover={{ scale: 1.05 }}
        onClick={handleBack}
      >
        🔙 Plan Another Trip
      </motion.button>
    </div>
  );
};

export default GenerateItinerary;
