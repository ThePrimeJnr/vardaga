import IntentHeaders from "../components/IntentsHeaders";
import TreeIcon from "../icons/Tree";
import BookIcon from "../icons/Book";
import ChatIcon from "../icons/Chat";
import LeafIcon from "../icons/Leaf";

function IntentSelection() {
    return <div className={'bg-gradient-to-b from-[#FFE0DE] to-[#FFFFFF] h-full w-full px-8 pt-4'}>
        <div className={'mb-3 font-bold text-2xl'}>
            <div>Hello!</div>
            <div>How can I help?</div>
        </div>
        <div className={'grid grid-flow-row gap-3 '}>
            <IntentHeaders icon={
                <TreeIcon width={60} height={60} className={'mr-3'}/>
            } text={"Find elderly care"} chatType={'elderly_care_services'}/>
            <IntentHeaders icon={
                <BookIcon width={60} height={60} className={'mr-3'}/>
            } text={"Apply services"} chatType={'apply_chat'}/>
            <IntentHeaders icon={
                <ChatIcon width={60} height={60} className={'mr-3'}/>
            } text={"Find person or business"} chatType={'general_chat'}/>
            <IntentHeaders icon={
                <LeafIcon width={40} height={60} className={'mr-3'}/>
            } text={"General Inquiry"} chatType={'general_chat'}/>
        </div>
    </div>
}

export default IntentSelection;