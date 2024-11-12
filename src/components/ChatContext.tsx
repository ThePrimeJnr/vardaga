import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {useReactMediaRecorder} from 'react-media-recorder';
import {ChatContextType, ChatResponse, ChatType, Message} from "../types";

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
    sendVoiceMessage: async () => {}
};
export const ChatContext = createContext<ChatContextType>(defaultContext);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [voiceInputActive, setVoiceInputActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
    ]);
    const [input, setInput] = useState<string>("");
    const [audioBlob, setAudioBlob] = useState<Blob>();
    const [shouldSend, setShouldSend] = useState(false);
    const [intent, setIntent] = useState<ChatType['type']>("general_chat")
    const [sessionId, setSessionId] = useState<string>("")
    const {status, startRecording, stopRecording, clearBlobUrl} =
        useReactMediaRecorder({
            audio: true,
            onStop: async (blobUrl, blob) => {
                setAudioBlob(blob);
            },
        });

    const _getEndpoint: (type: "refresh" | "start" | "chat" | "speech2text" | "voice") => string = (type) => {

        let endpointType = ""
        const chatBackendBaseUrl = process.env.REACT_APP_CHAT_BASEURL;
        switch (intent) {
            case "elderly_care_services":
                endpointType = `${chatBackendBaseUrl}/elderly_care_chat`
                break;

            case "general_chat":
                endpointType = `${chatBackendBaseUrl}/general_chat`
                break;
            case "apply_chat":
                endpointType = `${chatBackendBaseUrl}/apply_chat`
                break;
            default:
                endpointType = `${chatBackendBaseUrl}/general_chat`
                break;
        }
        switch (type) {
            case "chat":
                return `${endpointType}/chat_text/`
            case "refresh":
                return `${endpointType}/refresh/`
            case "start":
                return `${endpointType}/`
            case "speech2text":
                return `${chatBackendBaseUrl}/test/speech2text/`
            case "voice":
                return `${endpointType}/chat_voice/`
            default:
                return `${endpointType}/`
        }
    }
    const startChat = async () => {
        const endpoint = _getEndpoint("start");
        const response = await fetch(endpoint)
        const j = await response.json()
        setSessionId(j['_uuid'])
        const finalEndpoint = _getEndpoint("chat");
        if (finalEndpoint && j['_uuid']) {
            const r = await fetch(`${finalEndpoint}`, {
                method: 'POST',
                body: JSON.stringify({
                    session_id: j['_uuid'],
                    question: "Hi"
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const response: ChatResponse = await r.json();
            if (response.type == "msg") {
                setMessages((prevMessages) => [...prevMessages, {
                    from: 'bot',
                    message: response.answer || "",
                    type: "msg"
                }]);
            }
        }
    }

    const clearChatHistory = () => {
        setMessages([])
    }
    const sendMessage = async () => {
        const finalEndpoint = await _getEndpoint("chat");
        if (finalEndpoint) {
            setMessages((prevMessages) => [...prevMessages, {
                from: 'user',
                message: input,
                type: 'msg'
            }]);
            setInput("");
            const r = await fetch(`${finalEndpoint}`, {
                method: 'POST',
                body: JSON.stringify({
                    session_id: sessionId,
                    question: input
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const chatData: ChatResponse = await r.json();
            if (chatData.type == "sr") {
                chatData.sr_list.forEach((service) => {
                    setMessages((prevMessages) => [...prevMessages, {
                        from: 'bot',
                        name: service.name,
                        about: service.about,
                        imageUrl: service.image,
                        type: 'sr',
                        buttons: [
                            {
                                name: "Visit",
                                source: service.source
                            },
                            {
                                name: "Book",
                                source: "#"
                            }
                        ]
                    }]);
                })
            } else {
                setMessages((prevMessages) => [...prevMessages, {
                    from: 'bot',
                    message: chatData.answer || "",
                    type: 'msg'
                }])
            }
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
        if (shouldSend && status === "stopped") {
            sendVoiceForSpeech2Text();
            setShouldSend(false);
        }
    }, [status]);

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
