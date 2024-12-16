import AvatarManIcon from "../icons/AvatarMan";
import RobotIcon from "../icons/Robot";
import { Message } from "../types";
import { useContext, useEffect } from 'react';
import { ChatContext } from './ChatContext';
import { useVoiceVisualizer, VoiceVisualizer } from 'react-voice-visualizer';
import PlayIcon from "../icons/Play";
import PauseIcon from "../icons/Pause";

type MessageContainerType = {
    content: string | undefined;
    from: "user" | "bot"
    displayLabel: boolean
    imageUrl?: string
    buttons?: {
        name: string
        source: string
    }[]
    name?: string
    about?: string
    type: Message['type']
    audioUrl?: string
    timestamp?: Date
}

function MessageContainer({ from, type, content, displayLabel, imageUrl, buttons, about, name, audioUrl, timestamp }: MessageContainerType) {
    const messageRecorderControls = useVoiceVisualizer();

    useEffect(() => {
        if (audioUrl && type === 'voice') {
            fetch(audioUrl)
                .then(response => response.blob())
                .then(blob => {
                    messageRecorderControls.setPreloadedAudioBlob(blob);
                })
                .catch(error => console.error('Error loading audio:', error));
        }
    }, [audioUrl]);

    const formatTime = (date?: Date) => {
        if (!date) return '';
        return new Intl.DateTimeFormat('sv-SE', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className={`w-full mb-4 transform transition-all duration-300 ${from === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
            {displayLabel && (
                <div className={`flex items-center mb-2 space-x-2 animate-fade-in ${from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="p-2 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                        {from === "bot" ?
                            <RobotIcon width={24} height={24} className="text-accent-900 animate-pulse" /> :
                            <AvatarManIcon width={24} height={24} className="text-gray-600" />
                        }
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                        {from === "bot" ? "Svardaga" : "You"}
                    </div>
                </div>
            )}
            <div className={`${from === 'user' ? 'bg-transparent' : 'bg-white'} 
                rounded-xl p-3 max-w-[80%] relative group`}>
                {type === 'voice' ? (
                    <div className="flex flex-col">
                        <div className={`
                            min-w-[200px] p-2 flex items-center gap-2
                            ${from === 'user' ? 'bg-accent-900' : 'bg-white/80'} 
                            rounded-xl
                        `}>
                            <button 
                                onClick={() => messageRecorderControls.togglePauseResume()}
                                className={`
                                    p-2 rounded-full hover:bg-opacity-10 hover:bg-white
                                    ${from === 'user' ? 'text-white' : 'text-accent-900'}
                                `}
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
                                mainBarColor={from === 'user' ? "#C1C1C1" : "#C1C1C1"}
                                secondaryBarColor={from === 'user' ? "#ffffff" : "#ffffff"}
                                isControlPanelShown={false}
                                isDefaultUIShown={false}
                                onlyRecording={false}
                                isProgressIndicatorShown={false}
                                mainContainerClassName="flex-1"
                                canvasContainerClassName="flex-1"
                                speed={4}
                                barWidth={2}
                                gap={1}
                            />
                        </div>
                        {timestamp && (
                            <div className={`
                                text-xs mt-2 text-right
                              text-gray-500
                            `}>
                                {formatTime(timestamp)}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={`
                       rounded-2xl p-4 shadow-md transition-all duration-300 backdrop-blur-sm
                        ${from === "bot"
                            ? type === 'sr'
                                ? "border-2 border-accent-100 hover:border-accent-900 bg-white/80"
                                : "bg-white/80 hover:bg-white"
                            : "bg-accent-900 text-white hover:bg-accent-800"
                        }
                        ${!displayLabel ? (from === 'user' ? 'mr-12' : 'ml-12') : ''}
                        transform transition-gpu hover:scale-[1.01]
                    `}>
                        <div className="whitespace-pre-wrap">{content}</div>
                        {timestamp && (
                            <div className={`
                                text-xs mt-2 text-right text-white 
                            `}>
                                {formatTime(timestamp)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessageContainer;