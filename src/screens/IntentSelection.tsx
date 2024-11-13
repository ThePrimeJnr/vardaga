import IntentHeaders from "../components/IntentsHeaders";
import TreeIcon from "../icons/Tree";
import BookIcon from "../icons/Book";
import ChatIcon from "../icons/Chat";
import LeafIcon from "../icons/Leaf";
import { ChatType } from "../types";

function IntentSelection() {
    const intentItems: Array<{
        icon: React.ReactNode;
        text: string;
        type: ChatType['type'];
    }> = [
            {
                icon: <TreeIcon width={60} height={60} className="mr-3" />,
                text: "Find elderly care",
                type: 'elderly_care_services'
            },
            {
                icon: <BookIcon width={60} height={60} className="mr-3" />,
                text: "Apply services",
                type: 'apply_chat'
            },
            {
                icon: <ChatIcon width={60} height={60} className="mr-3" />,
                text: "Find person or business",
                type: 'general_chat'
            },
            {
                icon: <LeafIcon width={40} height={60} className="mr-3" />,
                text: "General Inquiry",
                type: 'general_chat'
            }
        ];

    return (
        <div className="bg-gradient-to-b from-[#FFE0DE] to-[#FFFFFF] h-full w-full px-8 pt-4">
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
        </div>
    )
}

export default IntentSelection;