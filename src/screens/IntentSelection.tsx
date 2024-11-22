import IntentHeaders from "../components/IntentsHeaders";
import TreeIcon from "../icons/Tree";
import BookIcon from "../icons/Book";
import ChatIcon from "../icons/Chat";
import LeafIcon from "../icons/Leaf";
import { ChatType } from "../types";
import { useContext } from "react";
import { ChatContext } from "../components/ChatContext";
import MicOn from "../icons/MicOn";
import Send from "../icons/Send";
import { useNavigate } from "react-router-dom";

function IntentSelection() {
    const navigate = useNavigate();
    const chatContext = useContext(ChatContext);
    const { input, setInput, sendMessage } = chatContext;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
        if (e.target.value.length === 1) {
            navigate('/chat', { replace: true });
        }
    };

    const intentItems: Array<{
        icon: React.ReactNode;
        text: string;
        type: ChatType['type'];
    }> = [
        {
            icon: <TreeIcon width={40} height={40} className="mr-3" />,
            text: "Find elderly care",
            type: 'elderly_care_services'
        },
        {
            icon: <BookIcon width={40} height={40} className="mr-3" />,
            text: "Apply services",
            type: 'apply_chat'
        },
        {
            icon: <ChatIcon width={40} height={40} className="mr-3" />,
            text: "Find person or business",
            type: 'general_chat'
        },
        {
            icon: <LeafIcon width={40} height={40} className="mr-3" />,
            text: "General Inquiry",
            type: 'general_chat'
        }
    ];

    return (
        <div className="bg-gradient-to-b from-[#FFE0DE] to-[#FFFFFF] h-full w-full px-8 pt-4 relative pb-16">
            <div className="mb-6 font-bold text-2xl animate-fade-in">
                <div>Hello!</div>
                <div>How can I help?</div>
            </div>
            <div className="grid grid-flow-row gap-4">
                {intentItems.map((item, index) => (
                    <div
                        key={index}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <IntentHeaders
                            icon={item.icon}
                            text={item.text}
                            chatType={item.type}
                        />
                    </div>
                ))}
            </div>
            
            <div className="flex items-center bg-white/80 backdrop-blur-md rounded-xl 
                border border-gray-200 shadow-lg justify-between 
                absolute bottom-0 transition-all duration-300 
                hover:shadow-xl mx-8 mb-4 left-0 right-0">
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                            navigate('/chat', { replace: true });
                            await sendMessage();
                        }
                    }}
                    className="w-full bg-transparent focus:outline-none focus:ring-0 
                             px-4 py-2 text-gray-700 placeholder-gray-400"
                    placeholder="Type a message..."
                />
                <div className="flex items-center space-x-3">
                    <button className="p-3 rounded-full hover:bg-accent-100">
                        <MicOn height={25} width={25} fill="currentColor" />
                    </button>
                    {input.length > 0 && (
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
    );
}

export default IntentSelection;