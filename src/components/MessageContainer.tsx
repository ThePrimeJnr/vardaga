import AvatarManIcon from "../icons/AvatarMan";
import RobotIcon from "../icons/Robot";
import { Message } from "../types";

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
}

function MessageContainer({ from, type, content, displayLabel, imageUrl, buttons, about, name, audioUrl }: MessageContainerType) {
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
                <div className="flex flex-wrap gap-4">
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            className="rounded-xl max-w-[200px] object-cover shadow-lg 
                                     transition-transform duration-300 hover:scale-105"
                            alt="message image"
                        />
                    )}
                    <div className="flex-1 space-y-2">
                        {name && <div className="font-bold text-xl">{name}</div>}
                        {about && <div className={`${from === "bot" ? "text-gray-600" : "text-gray-200"}`}>{about}</div>}
                        {content && (
                            <div className={`${from === "bot" ? "text-gray-800" : "text-white"} 
                                          leading-relaxed whitespace-pre-wrap`}>
                                {content}
                            </div>
                        )}
                        {audioUrl && (
                            <audio
                                controls
                                src={audioUrl}
                                className="w-full mt-2 rounded-lg shadow-sm"
                            />
                        )}
                    </div>
                </div>

                {buttons && (
                    <div className="flex flex-wrap gap-2 mt-4">
                        {buttons.map((button, index) => (
                            <button
                                key={index}
                                className="px-6 py-2 rounded-full bg-white text-accent-900 
                                         font-medium shadow-md transition-all duration-300 
                                         hover:shadow-lg hover:scale-105 active:scale-95
                                         border border-accent-100"
                            >
                                {button.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessageContainer;