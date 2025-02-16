import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { ChatContext } from "../components/ChatContext";
import MessageContainer from "../components/MessageContainer";
import ServiceCard from "../components/ServiceCard";
import TypingAnimation from "../components/TypingAnimation";
import MicOn from "../icons/MicOn";
import PauseIcon from "../icons/Pause";
import PlayIcon from "../icons/Play";
import Send from "../icons/Send";
import Square from "../icons/Square";
import TrashIcon from "../icons/Trash";
import { Message } from "../types";

function Chat() {
  const navigate = useNavigate();
  const {
    messages,
    input,
    setInput,
    sendMessage,
    voiceInputActive,
    setVoiceInputActive,
    sendVoiceMessage,
    isLoading,
  } = useContext(ChatContext);

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const recorderControls = useVoiceVisualizer({
    onStartRecording: () => {
      setIsRecording(true);
      setVoiceInputActive(true);
      startTimer();
    },
    onStopRecording: () => {
      stopTimer();
    },
  });

  useEffect(() => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
    }

    const lastMessage = messages[messages.length - 1];
    if (
      lastMessage?.role === "assistant" &&
      lastMessage.message.includes("EXIT")
    ) {
      navigate("/");
      return;
    }
  }, [messages, navigate]);

  const startTimer = () => {
    setTimeElapsed(0);
    const t = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    setTimer(t);
  };

  const stopTimer = () => {
    if (timer) clearInterval(timer);
  };

  const handleSendVoiceMessage = () => {
    if (isRecording) {
      recorderControls.stopRecording();
      setTimeout(() => {
        if (recorderControls.recordedBlob instanceof Blob) {
          sendVoiceMessage(recorderControls.recordedBlob);
          setVoiceInputActive(false);
          recorderControls.clearCanvas();
        }
      }, 500);
    }
  };

  const handleStopRecording = () => {
    if (isRecording) {
      recorderControls.stopRecording();
      setIsRecording(false);
    }
  };

  const handleSendTextMessage = (text: string) => {
    sendMessage(text);
  };

  const lastMessage = messages[messages.length - 1] as Message | undefined;
  const showQuickReplies =
    lastMessage?.role === "assistant" &&
    lastMessage.quick_replies &&
    lastMessage.quick_replies.length > 0;
  const showServiceCards =
    lastMessage?.role === "assistant" &&
    lastMessage.service_cards &&
    lastMessage.service_cards.length > 0;

  return (
    <div className="chat-container w-full h-full relative bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Main scrollable area */}
      <div
        className="flex-1 overflow-y-auto scroll-smooth"
        ref={scrollContainer}
        style={{
          scrollbarWidth: "thin",
        }}
      >
        <div className="flex flex-col gap-y-2 pt-4 px-4">
          {messages.map((msg, index) => (
            <MessageContainer
              key={index}
              message={msg.message}
              references={msg.references}
              role={msg.role}
              type={msg.type}
              timestamp={msg.timestamp}
              displayLabel={
                index === 0 || messages[index - 1]?.role !== msg.role
              }
              audioUrl={msg.audioUrl}
            />
          ))}

          {showQuickReplies && (
            <div className="quick-replies ml-12 mb-4 animate-fade-in">
              <div className="flex flex-wrap gap-2">
                {lastMessage.quick_replies?.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendTextMessage(reply)}
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

          {showServiceCards && (
            <div className="ml-12 mb-4 grid grid-cols-1 gap-4 animate-fade-in">
              {lastMessage.service_cards?.map((card, index) => (
                <ServiceCard
                  home_name={""}
                  contact_email={""}
                  url={""}
                  images={[]}
                  key={index}
                  {...card}
                />
              ))}
            </div>
          )}

          {isLoading && <TypingAnimation />}
        </div>
      </div>

      {/* Chat input fixed at bottom */}
      <div className="sticky bottom-0 px-4 pb-4 bg-gradient-to-b from-transparent to-gray-50 pt-2">
        <div className="chat-input flex items-center bg-white rounded-xl border border-gray-200 shadow-lg justify-between">
          {!voiceInputActive ? (
            <>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  handleSendTextMessage(input)
                }
                className="w-full bg-white focus:outline-none px-4 py-2 text-gray-700"
                placeholder="Skriv här..."
              />
              {input ? (
                <button
                  onClick={() => handleSendTextMessage(input)}
                  className="p-3 rounded-full hover:bg-accent-100 transition-all"
                >
                  <Send height={25} width={25} />
                </button>
              ) : (
                <button
                  onClick={recorderControls.startRecording}
                  className="p-3 rounded-full hover:bg-accent-100 transition-all"
                >
                  <MicOn height={25} width={25} />
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex items-center p-2">
              <div className="flex-1 mx-4">
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-accent-900 w-1/5">
                    {Math.floor(timeElapsed / 60)}:
                    {(timeElapsed % 60).toString().padStart(2, "0")}
                  </div>
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
              <div className="flex space-x-2">
                {!isRecording && recorderControls.recordedBlob ? (
                  <>
                    <button
                      onClick={() => {
                        recorderControls.togglePauseResume();
                        setIsPlaying(!isPlaying);
                      }}
                      className="p-2 rounded-full hover:bg-accent-100"
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
                      }}
                      className="p-2 rounded-full hover:bg-red-100 text-red-500"
                    >
                      <TrashIcon width={24} height={24} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="p-2 rounded-full hover:bg-red-100 text-red-500"
                  >
                    <Square width={24} height={24} />
                  </button>
                )}
                <button
                  onClick={handleSendVoiceMessage}
                  className="p-2 rounded-full bg-accent-900 text-white"
                >
                  <Send height={24} width={24} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
