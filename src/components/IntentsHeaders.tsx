import ArrowRight from "../icons/ArrowRight";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "./ChatContext";
import { useContext } from "react";
import { ChatType } from "../types";

function IntentHeaders({ icon, text, chatType }: { icon: any, text: string, chatType: ChatType['type'] }) {

    const chatContext = useContext(ChatContext);
    const {
        setIntent,
        setInput
    } = chatContext;
    const navigate = useNavigate();

    const handleClick = () => {
        setIntent(chatType);
        setInput(text);
        navigate('/chat', { replace: true });
    };

    return <div
        className={`
            bg-white rounded-xl py-2 px-6 
            hover:cursor-pointer 
            border-2 border-gray-100
            hover:border-accent-900 
            flex w-full items-center flex-row
            transition-all duration-300
            transform hover:scale-[1.02] hover:shadow-lg
            active:scale-[0.98]
        `}
        onClick={handleClick}
    >
        <div className="transition-transform duration-300 group-hover:scale-110 ">
            {icon}
        </div>
        <span className="whitespace-nowrap ml-3 font-medium text-gray-700">
            {text}
        </span>
        <div className="flex justify-end w-full">
            <ArrowRight
                width={20}
                height={20}
                fill="currentColor"
                className="text-accent-900 transition-transform duration-300 
                         group-hover:translate-x-1"
            />
        </div>
    </div>
}

export default IntentHeaders;