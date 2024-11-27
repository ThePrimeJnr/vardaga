import MessageContainer from "../components/MessageContainer";
import MicOn from "../icons/MicOn";
import Send from "../icons/Send";
import Square from "../icons/Square";
import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../components/ChatContext";

function Chat() {
    const chatContext = useContext(ChatContext);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [timer, setTimer] = useState<NodeJS.Timeout>();
    const scrollContainer = useRef<HTMLDivElement | null>(null);
    const [nextIsVoice, setNextIsVoice] = useState(false)
    const {
        messages, input, setInput, sendMessage, status,
        setDisplayLabel, voiceInputActive, setVoiceInputActive,
        cancelRecording, startChat, clearChatHistory,
        sendVoiceMessage, sendRecording, startRecording, 
        stopRecording, setShouldSend, clearBlobUrl
    } = chatContext;

    // timers for voice recording
    const startTimer = () => {
        const t = setInterval(() => {
            setTimeElapsed(prev => prev + 1);
        }, 1000);
        setTimer(t);
    };

    const stopTimer = () => {
        if (timer) clearInterval(timer);
        setTimeElapsed(0);
    };

    const handleVoiceRecording = () => {
        if (voiceInputActive) {
            stopTimer();
            sendRecording();
        } else {
            startTimer();
            startRecording();
            setVoiceInputActive(true);
        }
    };

    // Initialize chat only once when component mounts
    useEffect(() => {
        let mounted = true;

        const initChat = async () => {
            if (mounted) {
                try {
                    await startChat();
                } catch (error) {
                    console.error('Error initializing chat:', error);
                }
            }
        };

        initChat();

        return () => {
            mounted = false;
            clearChatHistory();
        };
    }, []); // Empty dependency array

    // Separate useEffect for scroll behavior
    useEffect(() => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="w-full h-full relative pb-16 bg-gradient-to-b from-white to-gray-50">
            <div className="pb-3 overflow-hidden h-full">
                <div className="px-6 flex flex-col h-full overflow-auto scroll-smooth" ref={scrollContainer}>
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
                            />
                        </div>
                    ))}
                </div>
            </div>

            {messages.length > 0 && messages[messages.length - 1].from === 'bot' && messages[messages.length - 1].quick_replies && (
                <div className="absolute bottom-16 left-0 right-0 px-8 py-2 bg-gradient-to-t from-white via-white">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {messages[messages.length - 1].quick_replies.map((reply, index) => (
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

            <div className="flex items-center bg-white/80 backdrop-blur-md rounded-xl 
                border border-gray-200 shadow-lg justify-between 
                absolute bottom-0 transition-all duration-300 
                hover:shadow-xl mx-8 mb-4 left-0 right-0">
                {!voiceInputActive ? (
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                if (!nextIsVoice) {
                                    await sendMessage()
                                } else {
                                    await sendVoiceMessage();
                                    setNextIsVoice(false)
                                }
                            }
                        }}
                        className="w-full bg-transparent focus:outline-none focus:ring-0 
                                 px-4 py-2 text-gray-700 placeholder-gray-400"
                        placeholder="Skriv här."
                    />
                ) : (
                    <div className="flex items-center justify-center w-full">
                        <div className="text-accent-900 font-bold animate-pulse-soft">
                            Recording... {`${Math.floor(timeElapsed / 60)}:${(timeElapsed % 60) < 10 ? `0${timeElapsed % 60}` : timeElapsed % 60}`}
                        </div>
                    </div>
                )}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleVoiceRecording}
                        className={`p-3 rounded-full transition-all duration-300 
                            transform hover:scale-110 active:scale-95
                            ${voiceInputActive
                                ? 'bg-accent-900 text-white shadow-lg'
                                : 'hover:bg-accent-100'} 
                            ${status === 'recording' && 'animate-pulse-soft'}`}
                    >
                        {voiceInputActive ?
                            <Square width={20} height={20} stroke="currentColor" fill="transparent" /> :
                            <MicOn height={25} width={25} fill="currentColor" />
                        }
                    </button>
                    {input.length > 0 && !voiceInputActive && (
                        <button
                            onClick={sendMessage}
                            className="p-3 rounded-full bg-accent-900 text-white 
                                     transition-all duration-300 transform 
                                     hover:scale-110 active:scale-95 shadow-lg"
                        >
                            <Send height={25} width={25} fill="currentColor" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Chat