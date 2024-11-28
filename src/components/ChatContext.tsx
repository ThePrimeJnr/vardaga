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
    setVoiceInputActive: () => {},
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
    const [messagesByIntent, setMessagesByIntent] = useState<Record<ChatType['type'], Message[]>>({
        elderly_care_services: [],
        apply_chat: [],
        general_chat: [],
        general_questions: []
    });
    const [currentIntent, setCurrentIntent] = useState<ChatType['type']>('general_chat');
    const [input, setInput] = useState<string>("");
    const [audioBlob, setAudioBlob] = useState<Blob>();
    const [shouldSend, setShouldSend] = useState(false);
    const [sessionId, setSessionId] = useState<string>("");
    const { status, startRecording, stopRecording, clearBlobUrl } =
        useReactMediaRecorder({
            audio: true,
            onStop: async (blobUrl, blob) => {
                setAudioBlob(blob);
            },
        });
    const [isLoading, setIsLoading] = useState(false);

        const _getEndpoint = (type?: 'voice' | 'chat') => {
            const baseUrl = process.env.REACT_APP_CHAT_BASEURL;
            switch (type) {
                case 'voice':
                    return `${baseUrl}/api/v2/chatbot/voice`;
                default:
                    return `${baseUrl}/api/v2/chatbot/chat`;
            }
        };

    const startChat = async () => {
        // Do nothing - we'll let sendIntentMessage handle the start message
    };

    const clearChatHistory = () => {
        setMessagesByIntent(prev => ({
            ...prev,
            'elderly_care_services': [],
            'general_chat': [],
            'apply_chat': [],
            'general_questions': []
        }));
    }
    const sendMessage = async (quickReplyMessage?: string) => {
        const messageToSend = quickReplyMessage || input;
        if (!messageToSend?.trim()) return;

        setInput("");
        setIsLoading(true);

        setMessagesByIntent(prev => ({
            ...prev,
            [currentIntent]: [...prev[currentIntent], {
                from: 'user',
                message: messageToSend,
                type: 'msg'
            }]
        }));

        try {
            const endpoint = _getEndpoint();
            const agent = getAgentName(currentIntent);
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    session_id: sessionId || "default",
                    message: messageToSend,
                    agent_name: agent || "general"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const answer = await response.json();
            setMessagesByIntent(prev => ({
                ...prev,
                [currentIntent]: [...prev[currentIntent], {
                    from: 'bot',
                    message: answer.message,
                    quick_replies: answer.quick_replies,
                    service_cards: answer.service_cards,
                    type: 'msg'
                }]
            }));
        } catch (error) {
            console.error('Error sending message:', error);
            setMessagesByIntent(prev => ({
                ...prev,
                [currentIntent]: [...prev[currentIntent], {
                    from: 'bot',
                    message: "Sorry, I encountered an error. Please try again.",
                    type: 'msg'
                }]
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const setDisplayLabel = (msgs: Message[], index: number): boolean => {
        if (index === 0) return true;
        return messagesByIntent[currentIntent][index - 1].from !== msgs[index].from; // If the last message is from the same person, return false. 
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
    // For sending recorded voice to backend (not working)
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

    const sendVoiceMessage = async (audioBlob: Blob) => {
        const endpoint = _getEndpoint('voice');
        if (!endpoint) return;

        try {
            const formData = new FormData();
            formData.append('session_id', sessionId || 'default');
            formData.append('message', 'Voice message');
            formData.append('audio_file', audioBlob, 'audio.wav');

            setMessagesByIntent(prev => ({
                ...prev,
                [currentIntent]: [...prev[currentIntent], {
                    from: 'user',
                    type: 'voice',
                    message: 'Voice message sent'
                }]
            }));

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const transcription = await response.text();
            
            const chatResponse = await fetch(_getEndpoint('chat'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: sessionId || 'default',
                    message: transcription
                })
            });

            if (!chatResponse.ok) {
                throw new Error(`HTTP error! status: ${chatResponse.status}`);
            }

            const answer = await chatResponse.text();
            setMessagesByIntent(prev => ({
                ...prev,
                [currentIntent]: [...prev[currentIntent], {
                    from: 'bot',
                    message: answer,
                    type: 'msg'
                }]
            }));

        } catch (error) {
            console.error('Error sending voice message:', error);
            setMessagesByIntent(prev => ({
                ...prev,
                [currentIntent]: [...prev[currentIntent], {
                    from: 'bot',
                    message: "Sorry, I encountered an error processing your voice message.",
                    type: 'msg'
                }]
            }));
        }
    };

    useEffect(() => {
        const handleVoiceRecording = async () => {
            if (shouldSend && status === "stopped" && audioBlob) {
                await sendVoiceMessage(audioBlob);
                setShouldSend(false);
                setVoiceInputActive(false);
            }
        };
    
        handleVoiceRecording();
    }, [status, shouldSend, audioBlob]);

    const sendIntentMessage = async (intentType: ChatType['type']) => {
        setCurrentIntent(intentType);
        
        if (messagesByIntent[intentType].length === 0) {
            try {
                const endpoint = _getEndpoint();
                const agent = getAgentName(intentType);
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        session_id: sessionId || "default",
                        message: "start",
                        agent_name: agent || "general"
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                setIsLoading(true);
                const answer = await response.json();
                
                // Small delay to show typing animation
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                setMessagesByIntent(prev => ({
                    ...prev,
                    [intentType]: [...prev[intentType], {
                        from: 'bot',
                        message: answer.message,
                        quick_replies: answer.quick_replies,
                        type: 'msg'
                    }]
                }));
                setIsLoading(false);
                
            } catch (error) {
                console.error('Error sending message:', error);
                setMessagesByIntent(prev => ({
                    ...prev,
                    [intentType]: [...prev[intentType], {
                        from: 'bot',
                        message: "Sorry, I encountered an error. Please try again.",
                        type: 'msg'
                    }]
                }));
                setIsLoading(false);
            }
        }
    };

    const getAgentName = (intentType: ChatType['type']): string | undefined => {
        switch (intentType) {
            case 'elderly_care_services':
                return 'service';
            case 'apply_chat':
                return 'apply';
            case 'general_chat':
                return 'contact';
            case 'general_questions':
                return 'general';
            default:
                return undefined;
        }
    };

    const contextValue = {
        messages: messagesByIntent[currentIntent],
        currentIntent,
        setCurrentIntent,
        input,
        setInput,
        sendMessage,
        status,
        setDisplayLabel,
        voiceInputActive,
        setVoiceInputActive,
        cancelRecording,
        sendRecording,
        startChat,
        clearChatHistory,
        sendVoiceMessage,
        startRecording,
        stopRecording,
        clearBlobUrl,
        setShouldSend,
        sendIntentMessage,
        isLoading,
        setIsLoading,
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};
