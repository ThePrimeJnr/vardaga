import ArrowRight from "../icons/ArrowRight";
import {useNavigate} from "react-router-dom";
import {ChatContext} from "./ChatContext";
import {useContext} from "react";
import {ChatType} from "../types";

function IntentHeaders({icon, text, chatType}: { icon: any, text: string, chatType: ChatType['type'] }) {

    const chatContext = useContext(ChatContext);
    const {
        setIntent
    } = chatContext;
    const navigate = useNavigate();
    return <div
        className={'bg-white rounded-md py-1 hover:cursor-pointer hover:bg-neutral-50 px-6 border-2 border-gray-200 flex w-full items-center flex-row'}
        onClick={() => {
            setIntent(chatType)
            navigate('/chat')
        }}
    >
        {icon}
        <span className={'whitespace-nowrap ml-3'}>{text}</span>
        <div className={'flex justify-end w-full'}>
            <ArrowRight width={26} height={26} fill={'black'}/>
        </div>
    </div>
}

export default IntentHeaders;