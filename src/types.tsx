import React from "react";

export type Agent = "service" | "contact" | "apply" | "general";

export const agentMap = {
  service: "Hitta äldreomsorg",
  apply: "Att söka äldreomsorg",
  contact: "Hitta kontaktinformation",
  general: "Allmäna frågor",
};
export type Service = {
  id: string;
  name: string;
  source: string;
  about: string;
  image: string;
};

export type Message = {
  type: "text" | "voice";
  role: "user" | "assistant";
  message: string;
  audioUrl?: string;
  quick_replies?: string[];
  references?: Reference[];
  service_cards?: Service[];
  timestamp: Date;
};
export interface Reference {
  url: string;
  title: string;
  description: string;
  image: string;
}
export interface ChatResponse {
  session_id: string;
  message: string;
  quick_replies?: string[];
  references?: Reference[];
}

export interface ChatContextType {
  voiceInputActive: boolean;
  messages: Message[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setAgent: React.Dispatch<React.SetStateAction<Agent>>;
  sendMessage: (quickReplyMessage?: string) => Promise<void>;
  setDisplayLabel: (msgs: Message[], index: number) => boolean;
  status: string;
  sendRecording: () => void;
  cancelRecording: () => void;
  startChat: (agent: Agent) => Promise<void>;
  clearChatHistory: () => void;
  sendVoiceMessage: (audioBlob: Blob) => Promise<void>;
  startRecording: () => void;
  stopRecording: () => void;
  clearBlobUrl: () => void;
  setShouldSend: React.Dispatch<React.SetStateAction<boolean>>;
  setVoiceInputActive: React.Dispatch<React.SetStateAction<boolean>>;
  sendAgentMessage: (agent: Agent) => void;
  currentAgent: Agent;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface MessageContainerType {
  from: "bot" | "user";
  type: "sr" | "msg" | "voice";
  content?: string;
  displayLabel: boolean;
  imageUrl?: string;
  buttons?: {
    name: string;
    source: string;
  }[];
  quick_replies?: string[];
  name?: string;
  about?: string;
  audioUrl?: string;
}
