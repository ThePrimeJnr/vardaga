import React from "react";

export type Service = {
    id: string;
    name: string;
    source: string;
    about: string;
    image: string;

}
export type ChatResponse = {
    type: 'sr' | 'msg';
    answer: string | null;
    sr_list: Service[]
}

export interface Message {
    type: 'sr' | 'msg' | 'voice'
    message?: string;
    from: 'bot' | 'user';
    imageUrl?: string;
    buttons?: {
        name: string
        source: string
    }[];
    quick_replies?: string[];
    name?: string;
    about?: string;
    source?: string;
    audioUrl?: string;

}

export interface ChatType {
    type: "elderly_care_services" | "general_chat" | "apply_chat" | "general_questions"
}

export interface ChatContextType {
    voiceInputActive: boolean;
    messages: Message[];
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    setIntent: React.Dispatch<React.SetStateAction<ChatType['type']>>;
    sendMessage: (quickReplyMessage?: string) => Promise<void>;
    setDisplayLabel: (msgs: Message[], index: number) => boolean;
    status: string;
    sendRecording: () => void;
    cancelRecording: () => void;
    startChat: () => Promise<void>;
    clearChatHistory: () => void;
    sendVoiceMessage: (audioBlob: Blob) => Promise<void>;
    startRecording: () => void;
    stopRecording: () => void;
    clearBlobUrl: () => void;
    setShouldSend: React.Dispatch<React.SetStateAction<boolean>>;
    setVoiceInputActive: React.Dispatch<React.SetStateAction<boolean>>;
    sendIntentMessage: (intentType: ChatType['type']) => void;
}

export interface MessageContainerType {
    from: 'bot' | 'user';
    type: 'sr' | 'msg' | 'voice';
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