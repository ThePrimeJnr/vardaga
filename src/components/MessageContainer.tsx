import { useEffect } from "react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import PlayIcon from "../icons/Play";
import PauseIcon from "../icons/Pause";
import ReactMarkdown from "react-markdown";
import References from "./References";
import { Reference } from "../types";

type MessageProps = {
  message: string;
  references?: Reference[];
  role: "user" | "assistant";
  type: "text" | "voice";
  timestamp: Date;
  displayLabel?: boolean;
  audioUrl?: string;
};

function MessageContainer({
  message,
  references,
  role,
  type,
  timestamp,
  audioUrl,
}: MessageProps) {
  const messageRecorderControls = useVoiceVisualizer();

  useEffect(() => {
    if (audioUrl && type === "voice") {
      fetch(audioUrl)
        .then((response) => response.blob())
        .then((blob) => messageRecorderControls.setPreloadedAudioBlob(blob))
        .catch((error) => console.error("Error loading audio:", error));
    }
  }, [audioUrl, messageRecorderControls, type]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div
      className={`w-full transform transition-all duration-300 ${
        role === "user"
          ? "flex flex-col items-end"
          : "flex flex-col items-start"
      }`}
    >
      <div className={"bg-transparent rounded-xl max-w-[80%] relative"}>
        {type === "voice" ? (
          <div className="flex flex-col">
            <div
              className={`min-w-[200px] p-2 flex items-center gap-2 ${
                role === "user" ? "bg-accent-900" : "bg-white/80"
              } rounded-xl`}
            >
              <button
                onClick={() => messageRecorderControls.togglePauseResume()}
                className={`p-2 rounded-full hover:bg-opacity-10 hover:bg-white ${
                  role === "user" ? "text-white" : "text-accent-900"
                }`}
              >
                {messageRecorderControls.isPausedRecordedAudio ? (
                  <PlayIcon width={16} height={16} />
                ) : (
                  <PauseIcon width={16} height={16} />
                )}
              </button>
              <VoiceVisualizer
                controls={messageRecorderControls}
                height={32}
                width="100%"
                backgroundColor="transparent"
                mainBarColor="#C1C1C1"
                secondaryBarColor="#ffffff"
                isControlPanelShown={false}
                isDefaultUIShown={false}
                speed={4}
                barWidth={2}
                gap={1}
                mainContainerClassName="flex-1"
                canvasContainerClassName="flex-1"
              />
            </div>
          </div>
        ) : (
          <div
            className={`
              rounded-2xl p-4 shadow-md 
              transition-all duration-300 transform hover:scale-[1.01]
              ${
                role === "assistant"
                  ? "bg-gray-100/80 hover:bg-gray-50"
                  : "bg-accent-900 text-white hover:bg-accent-800"
              }
            `}
          >
            <ReactMarkdown className="message">{message}</ReactMarkdown>
            <References references={references ?? []} />
          </div>
        )}
        <div className="text-xs mt-1 mr-2 text-right text-gray-500">
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
}

export default MessageContainer;
