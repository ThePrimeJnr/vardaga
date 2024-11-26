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
        'elderly_care_services': [],
        'general_chat': [],
        'apply_chat': []
    });
    const [currentIntent, setCurrentIntent] = useState<ChatType['type']>("general_chat");
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
        try {
            setMessagesByIntent(prev => ({
                ...prev,
                'general_chat': [{
                    from: 'bot',
                    message: "Hello! How can I assist you today?",
                    type: "msg"
                }]
            }));
        } catch (error) {
            console.error('Error in startChat:', error);
            setMessagesByIntent(prev => ({
                ...prev,
                'general_chat': [{
                    from: 'bot',
                    message: "I'm having trouble connecting right now. Please try again later.",
                    type: "msg"
                }]
            }));
        }
    };

    const clearChatHistory = () => {
        setMessagesByIntent(prev => ({
            ...prev,
            'elderly_care_services': [],
            'general_chat': [],
            'apply_chat': []
        }));
    }
    const sendMessage = async () => {
        if (!input.trim()) return;

        setMessagesByIntent(prev => ({
            ...prev,
            [currentIntent]: [...prev[currentIntent], {
                from: 'user',
                message: input,
                type: 'msg'
            }]
        }));
        setInput("");

        try {
            const endpoint = _getEndpoint();
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    session_id: sessionId || "default",
                    message: input,
                    intent: currentIntent
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
                    message: answer,
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
            setMessagesByIntent(prev => ({
                ...prev,
                [intentType]: [{
                    from: 'bot',
                    message: getIntentGreeting(intentType),
                    type: 'msg'
                }]
            }));

            setTimeout(async () => {
                setMessagesByIntent(prev => ({
                    ...prev,
                    [intentType]: [...prev[intentType], {
                        from: 'user',
                        message: 'Hi',
                        type: 'msg'
                    }]
                }));

                try {
                    const endpoint = _getEndpoint();
                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            session_id: sessionId || "default",
                            message: "Hi",
                            intent: intentType
                        })
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const answer = await response.json();
                    setMessagesByIntent(prev => ({
                        ...prev,
                        [intentType]: [...prev[intentType], {
                            from: 'bot',
                            message: answer,
                            type: 'msg'
                        }]
                    }));
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
                }
            }, 500);
        }
    };

    const getIntentGreeting = (intentType: ChatType['type']) => {
        switch (intentType) {
            case 'elderly_care_services':
                return "How can I help you find elderly care services today?";
            case 'apply_chat':
                return "What service would you like to apply for?";
            case 'general_chat':
                return "What would you like to know about?";
            default:
                return "Hello! How can I assist you today?";
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
        sendIntentMessage
    };

    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
};
