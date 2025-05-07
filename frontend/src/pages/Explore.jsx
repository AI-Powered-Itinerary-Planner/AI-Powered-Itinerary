import React, { useState } from "react";
import "./Explore.css";

const ExploreForm = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResponse("");


    try {
      const response = await fetch("http://localhost:3001/explore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      console.log("DeepSeek response status:", response.status);

      const data = await response.json();
      console.log("DeepSeek API raw response:", JSON.stringify(data, null, 2));
      setResponse(data.answer || "No answer returned.");
    } catch (err) {
      console.error("Error fetching AI response:", err);
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="explore-container">
      <h1>Explore New Destinations</h1>
      <p>Ask a travel question and our AI will help you discover amazing places 🌍</p>

      <form onSubmit={handleSubmit} className="explore-form">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder='e.g. "What are fun things to do in Lake Tahoe?"'
          rows="4"
        />
        <button type="submit" disabled={isLoading || !question.trim()}>
          {isLoading ? "Thinking..." : "Ask AI"}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {response && (
        <div className="explore-response">
          <strong>AI Travel Agent:</strong> <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default ExploreForm;