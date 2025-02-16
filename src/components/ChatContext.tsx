import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import api from "../utils/api";
import { Agent, Message } from "../types";

type ChatContextType = {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  sendMessage: (reply: string) => Promise<void>;
  startChat: (agent: Agent) => Promise<void>;
  clearChat: () => void;
  isLoading: boolean;
  agent: Agent;

  // Voice-related functions
  voiceInputActive: boolean;
  setVoiceInputActive: (active: boolean) => void;
  startRecording: () => void;
  stopRecording: () => void;
  cancelRecording: () => void;
  sendRecording: () => void;
  sendVoiceMessage: (blob: Blob) => Promise<void>;
};

// Create context with default values
export const ChatContext = createContext<ChatContextType>({
  messages: [],
  input: "",
  setInput: () => {},
  sendMessage: async () => {},
  startChat: async () => {},
  clearChat: () => {},
  isLoading: false,
  agent: "general",
  voiceInputActive: false,
  setVoiceInputActive: () => {},
  startRecording: () => {},
  stopRecording: () => {},
  cancelRecording: () => {},
  sendRecording: () => {},
  sendVoiceMessage: async () => {},
});

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState<string>("");
  const [voiceInputActive, setVoiceInputActive] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob>();
  const [shouldSend, setShouldSend] = useState(false);
  const [agent, setAgent] = useState<Agent>("general");

  const { status, startRecording, stopRecording, clearBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: (_, blob) => {
        setAudioBlob(blob);
      },
    });

  const startChat = async (agent: Agent) => {
    clearChat();
    setIsLoading(true);
    setAgent(agent);
    try {
      const response = await api.post("/api/chatbot/start", {
        agent: agent,
      });
      setSessionId(response.session_id);
      const welcomeMessage: Message = {
        message: response.message,
        type: "text",
        role: "assistant",
        timestamp: new Date(),
        quick_replies: response.quick_replies,
        references: response.references
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error("Error starting chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setSessionId("");
  };

  const sendMessage = async (reply: string) => {
    const message = reply.trim();
    if (!sessionId) return;

    setInput("");
    setIsLoading(true);

    try {
      const newMessage: Message = {
        message: message,
        type: "text",
        role: "user",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);

      const response = await api.post("/api/chatbot/message", {
        session_id: sessionId,
        message: message,
      });

      const assistantMessage: Message = {
        message: response.message,
        type: "text",
        role: "assistant",
        timestamp: new Date(),
        quick_replies: response.quick_replies,
        references: response.references
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelRecording = () => {
    setVoiceInputActive(!voiceInputActive);
    voiceInputActive ? stopRecording() : startRecording();
    clearBlobUrl();
  };

  const sendRecording = () => {
    stopRecording();
    setShouldSend(true);
  };

  const sendVoiceMessage = async (blob: Blob) => {
    if (!sessionId) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("session_id", sessionId);
      formData.append("audio_file", blob, "audio.wav");

      const response = await api.post("/api/chatbot/voice", formData);

      const assistantMessage: Message = {
        message: response.message,
        type: "text",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending voice message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shouldSend && status === "stopped" && audioBlob) {
      sendVoiceMessage(audioBlob);
      setShouldSend(false);
      setVoiceInputActive(false);
    }
  }, [status, shouldSend, audioBlob]);

  const contextValue: ChatContextType = {
    messages,
    input,
    setInput,
    sendMessage,
    startChat,
    clearChat,
    isLoading,
    agent,
    voiceInputActive,
    setVoiceInputActive,
    startRecording,
    stopRecording,
    cancelRecording,
    sendRecording,
    sendVoiceMessage,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
