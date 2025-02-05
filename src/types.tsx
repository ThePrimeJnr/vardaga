import React from "react";

export type Service = {
  id: string;
  name: string;
  source: string;
  about: string;
  image: string;
};

export type Message = {
  message: string;
  type: "text" | "voice";
  role: "user" | "assistant";
  timestamp: Date;
  quick_replies?: string[];
  service_cards?: Service[];
  audioUrl?: string;
};

export interface ChatResponse {
  session_id: string;
  message: string;
  quick_replies?: string[];
}

export interface OldMessage {
  message?: string;
  imageUrl?: string;
  buttons?: {
    name: string;
    source: string;
  }[];
  quick_replies?: string[];
  service_cards?: {
    home_name: string;
    about: string;
    contact_email: string;
    url: string;
    images: string[];
  }[];
  name?: string;
  about?: string;
  source?: string;
  audioUrl?: string;
  timestamp?: Date;
}

export type ChatType = "service" | "contact" | "apply" | "general";

export interface ChatContextType {
  voiceInputActive: boolean;
  messages: Message[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setIntent: React.Dispatch<React.SetStateAction<ChatType>>;
  sendMessage: (quickReplyMessage?: string) => Promise<void>;
  setDisplayLabel: (msgs: Message[], index: number) => boolean;
  status: string;
  sendRecording: () => void;
  cancelRecording: () => void;
  startChat: (agent: ChatType) => Promise<void>;
  clearChatHistory: () => void;
  sendVoiceMessage: (audioBlob: Blob) => Promise<void>;
  startRecording: () => void;
  stopRecording: () => void;
  clearBlobUrl: () => void;
  setShouldSend: React.Dispatch<React.SetStateAction<boolean>>;
  setVoiceInputActive: React.Dispatch<React.SetStateAction<boolean>>;
  sendIntentMessage: (intentType: ChatType) => void;
  currentIntent: ChatType;
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
