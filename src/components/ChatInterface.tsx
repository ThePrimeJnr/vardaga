import React, {
  useState,
  useEffect,
  useRef,
  FormEvent,
  ChangeEvent,
} from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  text: string;
  isBot: boolean;
}

function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputText.trim()) return; // Prevent sending empty messages

    const userMessage: Message = { text: inputText, isBot: false };
    const body = {
      chatHistory: [...messages, userMessage],
      question: inputText,
    };

    const botMessage: Message = { text: "", isBot: true };
    setMessages([...messages, userMessage, botMessage]);
    setInputText("");

    // const response = await fetch('http://5.161.229.199:8001/handle-query', {
    const response = await fetch("http://5.161.229.199:8000/chatbot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.body) return;

    const decoder = new TextDecoderStream();
    const reader = response.body.pipeThrough(decoder).getReader();
    let accumulatedAnswer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      accumulatedAnswer += value;
      setMessages((currentHistory) => {
        const updatedHistory = [...currentHistory];
        const lastChatIndex = updatedHistory.length - 1;
        updatedHistory[lastChatIndex] = {
          ...updatedHistory[lastChatIndex],
          text: accumulatedAnswer,
        };
        return updatedHistory;
      });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        Question & Answer with real estate
      </header>
      {messages.length === 0 && (
        <div className="chat-message bot-message">
          <p className="initial-message">
            Hi there! I'm a bot trained to answer questions about Real Estate
            Dataset in Sweden. Try asking me a question below!
          </p>
        </div>
      )}
      <div className="chat-messages">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type a question and press enter ..."
          value={inputText}
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}

export default ChatInterface;
