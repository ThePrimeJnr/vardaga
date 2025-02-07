import React from "react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: {
    text: string;
    isBot: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Only parse markdown for bot messages
  const content = message.isBot ? (
    <ReactMarkdown>{message.text}</ReactMarkdown>
  ) : (
    message.text
  );

  return (
    <div
      className={`chat-message ${message.isBot ? "bot-message" : "user-message"}`}
    >
      {content}
    </div>
  );
};

export default ChatMessage;
