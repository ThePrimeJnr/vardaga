import MessageContainer from "../components/MessageContainer";
import MicOn from "../icons/MicOn";
import Send from "../icons/Send";
import Square from "../icons/Square";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../components/ChatContext";
import ServiceCard from "../components/ServiceCard";
import TypingAnimation from "../components/TypingAnimation";
import PlayIcon from "../icons/Play";
import TrashIcon from "../icons/Trash";
import AudioProgress from "../components/AudioProgress";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import PauseIcon from "../icons/Pause";

function Chat() {
    const chatContext = useContext(ChatContext);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const [audioUrl, setAudioUrl] = useState<string>('');
    const [isRecording, setIsRecording] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const scrollContainer = useRef<HTMLDivElement | null>(null);
    
    const {
        messages, input, setInput, sendMessage,
        setDisplayLabel, voiceInputActive, setVoiceInputActive,
        sendVoiceMessage, startRecording, stopRecording,
        clearBlobUrl, isLoading, status
    } = chatContext;

    // Add mediaRecorder ref
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Initialize media recorder
    const initMediaRecorder = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            
            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                chunksRef.current = [];
            };
        } catch (err) {
            console.error('Error accessing microphone:', err);
        }
    };

    useEffect(() => {
        initMediaRecorder();
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, []);

    // Timer for voice recording
    const startTimer = () => {
        setTimeElapsed(0);
        const t = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);
        setTimer(t);
    };

    const stopTimer = () => {
        if (timer) clearInterval(timer);
    };

    const handleRecordingStart = (e: React.MouseEvent | React.TouchEvent) => {
        if ('touches' in e) {
            setStartY(e.touches[0].clientY);
        } else {
            setStartY(e.clientY);
        }
        setIsRecording(true);
        setVoiceInputActive(true);
        startTimer();
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.start();
        }
    };

    const handleRecordingMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isRecording) return;
        
        const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const diff = startY - currentY;
        
        if (diff > 50) {
            setIsDragging(true);
        } else {
            setIsDragging(false);
        }
    };

    const handleRecordingEnd = async () => {
        if (!isRecording) return;
        
        stopTimer();
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        setIsPaused(true);
        
        if (isDragging) {
            setVoiceInputActive(false);
            setIsDragging(false);
            setIsPaused(false);
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
                setAudioUrl('');
            }
        }
    };

    // Scroll behavior
    useEffect(() => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
        }
    }, [messages]);

    // Add voice visualizer controls
    const recorderControls = useVoiceVisualizer({
        onStartRecording: () => {
            setIsRecording(true);
            setVoiceInputActive(true);
            startTimer();
        },
        onStopRecording: () => {
            stopTimer();
            setIsRecording(false);
            setIsPaused(true);
            setTimeout(() => {
                if (recorderControls.recordedBlob && recorderControls.recordedBlob instanceof Blob) {
                    setAudioUrl(URL.createObjectURL(recorderControls.recordedBlob));
                }
            }, 100);
        }
    });

    const handleSendVoiceMessage = () => {
        if (isRecording) {
            recorderControls.stopRecording();
            setTimeout(() => {
                const sendButton = document.querySelector('button[aria-label="Send voice message"]');
                if (sendButton instanceof HTMLButtonElement) {
                    sendButton.click();
                }
            }, 500);
        } else if (recorderControls.recordedBlob && recorderControls.recordedBlob instanceof Blob) {
            sendVoiceMessage(recorderControls.recordedBlob);
            setVoiceInputActive(false);
            setIsPaused(false);
            recorderControls.clearCanvas();
        }
    };

    const handleStopRecording = () => {
        if (isRecording) {
            recorderControls.stopRecording();
            setIsRecording(false);
            setIsPaused(true);
        }
    };

    return (
        <div className="w-full h-full relative pb-16 bg-gradient-to-b from-white to-gray-50">
            <div className="h-full overflow-hidden">
                <div className="px-6 flex flex-col h-full overflow-y-auto scroll-smooth" ref={scrollContainer}>
                    {messages.map((msg, index) => (
                        <div key={index} className="transform transition-all duration-300 ease-in-out">
                            <MessageContainer
                                displayLabel={setDisplayLabel(messages, index)}
                                buttons={msg.buttons}
                                imageUrl={msg.imageUrl}
                                content={msg.message}
                                from={msg.from}
                                type={msg.type}
                                name={msg.name}
                                about={msg.about}
                                audioUrl={msg.audioUrl}
                                timestamp={msg.timestamp}
                            />
                            {isLoading && index === messages.length - 1 && (
                                <TypingAnimation />
                            )}
                            {msg.from === 'bot' && msg.quick_replies && msg.quick_replies.length > 0 && (
                                <div className="ml-12 mb-4">
                                    <div className="flex flex-wrap gap-2">
                                        {msg.quick_replies.map((reply, index) => (
                                            <button
                                                key={index}
                                                onClick={() => sendMessage(reply)}
                                                className="px-4 py-2 bg-accent-50 text-accent-900 
                                                         rounded-lg border border-accent-200
                                                         hover:bg-accent-100 hover:border-accent-300
                                                         active:scale-95 transform transition-all duration-200
                                                         text-sm font-medium shadow-sm
                                                         hover:shadow-md"
                                            >
                                                {reply}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {msg.from === 'bot' && msg.service_cards && msg.service_cards.length > 0 && (
                                <div className=" mb-4 grid grid-cols-1 gap-4">
                                    {msg.service_cards.map((card, index) => (
                                        <ServiceCard key={index} {...card} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {messages.length === 0 && isLoading && (
                        <TypingAnimation />
                    )}
                </div>
            </div>

            <div className="flex items-center bg-white/80 backdrop-blur-md rounded-xl 
                border border-gray-200 shadow-lg justify-between 
                absolute bottom-0 transition-all duration-300 
                hover:shadow-xl mx-8 mb-4 left-0 right-0">
                
                {!voiceInputActive ? (
                    <>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    sendMessage();
                                }
                            }}
                            className="w-full bg-transparent focus:outline-none focus:ring-0 
                                     px-4 py-2 text-gray-700 placeholder-gray-400"
                            placeholder="Skriv här..."
                        />
                        
                        <button
                            onClick={recorderControls.startRecording}
                            className="p-3 rounded-full transition-all duration-300 
                                     transform hover:scale-110 active:scale-95
                                     hover:bg-accent-100"
                        >
                            <MicOn height={25} width={25} fill="currentColor" />
                        </button>
                    </>
                ) : (
                    <div className="w-full flex items-center justify-between p-2">
                        {!isRecording && recorderControls.recordedBlob ? (
                            <>
                                <div className="flex-1 mx-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-sm text-accent-900 mb-1 w-1/5">
                                           {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                                        </div>
                                        <div className="flex-1">
                                            <VoiceVisualizer
                                                controls={recorderControls}
                                                height={40}
                                                width="100%"
                                                backgroundColor="transparent"
                                                mainBarColor="#ef4444"
                                                secondaryBarColor="#fee2e2"
                                                isControlPanelShown={false}
                                                isDefaultUIShown={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => {
                                            recorderControls.togglePauseResume();
                                            setIsPlaying(!isPlaying);
                                        }}
                                        className="p-2 rounded-full hover:bg-accent-100 text-accent-900"
                                    >
                                        {isPlaying ? (
                                            <PauseIcon width={24} height={24} />
                                        ) : (
                                            <PlayIcon width={24} height={24} />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => {
                                            recorderControls.clearCanvas();
                                            setVoiceInputActive(false);
                                            setIsPaused(false);
                                        }}
                                        className="p-2 rounded-full hover:bg-red-100 text-red-500"
                                    >
                                        <TrashIcon width={24} height={24} />
                                    </button>
                                    <button
                                        onClick={handleSendVoiceMessage}
                                        aria-label="Send voice message"
                                        className="p-2 rounded-full bg-accent-900 text-white"
                                    >
                                        <Send height={24} width={24} fill="currentColor" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                                <div className="flex-1 mx-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="text-sm text-accent-900 mb-1 w-1/5">
                                           {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
                                        </div>
                                        <div className="flex-1">
                                        <VoiceVisualizer
                                            controls={recorderControls}
                                            height={40}
                                            width="100%"
                                            backgroundColor="transparent"
                                            mainBarColor="#ef4444"
                                            secondaryBarColor="#fee2e2"
                                            isControlPanelShown={false}
                                            isDefaultUIShown={false}
                                        />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleStopRecording}
                                        className="p-2 rounded-full hover:bg-red-100 text-red-500"
                                    >
                                        <Square width={24} height={24} />
                                    </button>
                                    <button
                                        onClick={handleSendVoiceMessage}
                                        aria-label="Send voice message"
                                        className="p-2 rounded-full bg-accent-900 text-white"
                                    >
                                        <Send height={24} width={24} fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;