import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { ChatContextType, ChatResponse, ChatType, Message } from "../types";

const defaultContext: ChatContextType = {
    cancelRecording: () => {
    },
    startChat: async () => {
    },
    sendRecording: () => {
    },
    voiceInputActive: false,
    messages: [],
    input: '',
    setInput: () => {
    },
    setIntent: () => {
    },
    sendMessage: async () => {
    },
    setDisplayLabel: () => true,
    status: 'idle',
    clearChatHistory: () => {
    },
    sendVoiceMessage: async () => { }
};
export const ChatContext = createContext<ChatContextType>(defaultContext);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [voiceInputActive, setVoiceInputActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
    ]);
    const [input, setInput] = useState<string>("");
    const [audioBlob, setAudioBlob] = useState<Blob>();
    const [shouldSend, setShouldSend] = useState(false);
    const [intent, setIntent] = useState<ChatType['type']>("general_chat")
    const [sessionId, setSessionId] = useState<string>("")
    const { status, startRecording, stopRecording, clearBlobUrl } =
        useReactMediaRecorder({
            audio: true,
            onStop: async (blobUrl, blob) => {
                setAudioBlob(blob);
            },
        });

    const _getEndpoint = () => {
        return process.env.REACT_APP_CHAT_BASEURL + '/api/v2/chatbot/chat';
    };

    const startChat = async () => {
        try {
            setMessages([{
                from: 'bot',
                message: "Hello! How can I assist you today?",
                type: "msg"
            }]);
        } catch (error) {
            console.error('Error in startChat:', error);
            setMessages([{
                from: 'bot',
                message: "I'm having trouble connecting right now. Please try again later.",
                type: "msg"
            }]);
        }
    };

    const clearChatHistory = () => {
        setMessages([])
    }
    const sendMessage = async () => {
        const endpoint = _getEndpoint();
        if (!input.trim()) return;

        setMessages((prevMessages) => [...prevMessages, {
            from: 'user',
            message: input,
            type: 'msg'
        }]);
        setInput("");

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    session_id: sessionId || "default",
                    message: input
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const answer = await response.json();
            setMessages((prevMessages) => [...prevMessages, {
                from: 'bot',
                message: answer,
                type: 'msg'
            }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prevMessages) => [...prevMessages, {
                from: 'bot',
                message: "Sorry, I encountered an error. Please try again.",
                type: 'msg'
            }]);
        }
    };

    const setDisplayLabel = (msgs: Message[], index: number): boolean => {
        if (index === 0) return true;
        return messages[index - 1].from !== msgs[index].from; // If the last message is from the same person, return false. 
    };


    const cancelRecording = () => {
        setVoiceInputActive(!voiceInputActive)
        voiceInputActive ? stopRecording() : startRecording()
        clearBlobUrl()
    }
    const sendRecording = () => {
        stopRecording()
        setShouldSend(true)
    }
    // For sending recorded voice to backend
    const sendVoiceForSpeech2Text = async () => {
        if (audioBlob) {
            const endpoint = _getEndpoint("speech2text")
            const formData = new FormData();
            formData.append('file', audioBlob, 'audio.wav');
            const r = await fetch(endpoint, {
                method: "POST",
                body: formData
            });
            const json = await r.json();
            setInput(json['transcription']);
            setVoiceInputActive(!voiceInputActive);
        }
    };

    const sendVoiceMessage = async () => {
        const finalEndpoint = _getEndpoint("voice");
        if (finalEndpoint) {
            setMessages((prevMessages) => [...prevMessages, {
                from: 'user',
                message: input,
                type: 'msg'
            }]);
            setInput("");
            const response = await fetch(`${finalEndpoint}`, {
                method: 'POST',
                body: JSON.stringify({
                    session_id: sessionId,
                    question: input
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const blob = await response.blob()
            setMessages((prevMessages) => [...prevMessages, {
                from: 'bot',
                audioUrl: URL.createObjectURL(blob),
                type: 'voice'
            }]);


        }
    }

    useEffect(() => {
        const handleVoiceRecording = async () => {
            if (shouldSend && status === "stopped") {
                await sendVoiceForSpeech2Text();
                setShouldSend(false);
            }
        };

        handleVoiceRecording();
    }, [status, shouldSend, sendVoiceForSpeech2Text]);

    return (
        <ChatContext.Provider
            value={{
                messages,
                input,
                setInput,
                sendMessage,
                status,
                setDisplayLabel,
                voiceInputActive,
                cancelRecording,
                sendRecording,
                startChat,
                setIntent,
                clearChatHistory,
                sendVoiceMessage
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
