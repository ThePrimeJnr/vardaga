import AvatarManIcon from "../icons/AvatarMan";
import RobotIcon from "../icons/Robot";
import { Message } from "../types";
import { useContext } from 'react';
import { ChatContext } from './ChatContext';

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
    quick_replies?: string[]
}

function MessageContainer({ from, type, content, displayLabel, imageUrl, buttons, about, name, audioUrl, quick_replies }: MessageContainerType) {
    const { sendMessage } = useContext(ChatContext);

    console.log('MessageContainer props:', { from, type, content, quick_replies });

    const handleQuickReplyClick = (reply: string) => {
        sendMessage(reply);
    };

    return (
        <div className="w-full mb-4 transform transition-all duration-300 hover:translate-x-1">
            {displayLabel && (
                <div className="flex items-center mb-2 space-x-2 animate-fade-in">
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
            <div className={`
                rounded-2xl p-4 shadow-md transition-all duration-300 backdrop-blur-sm
                ${from === "bot"
                    ? type === 'sr'
                        ? "border-2 border-accent-100 hover:border-accent-900 bg-white/80"
                        : "bg-white/80 hover:bg-white"
                    : "bg-accent-900 text-white hover:bg-accent-800"
                }
                ${!displayLabel ? "ml-12" : ""}
                transform transition-gpu hover:scale-[1.01]
            `}>
                <div>{content}</div>
                
                {process.env.NODE_ENV === 'development' && from === "bot" && (
                    <div className="text-xs text-gray-400 mt-1">
                        Quick replies: {JSON.stringify(quick_replies)}
                    </div>
                )}
                
                {from === "bot" && quick_replies && quick_replies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {quick_replies.map((reply, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickReplyClick(reply)}
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
                )}
            </div>
        </div>
    );
}

export default MessageContainer;