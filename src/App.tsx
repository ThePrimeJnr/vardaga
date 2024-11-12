import './App.css';
import {useEffect, useState} from "react";
import io from "socket.io-client";
import TreeIcon from "./icons/Tree";
import ArrowRight from "./icons/ArrowRight";
import IntentHeaders from "./components/IntentsHeaders";
import BookIcon from "./icons/Book";
import ChatIcon from "./icons/Chat";
import LeafIcon from "./icons/Leaf";
import AvatarManIcon from "./icons/AvatarMan";
import ExpandIcon from "./icons/Expand";
import CloseIcon from "./icons/Close";
import RobotIcon from "./icons/Robot";
import Header from "./components/Header";
import {Outlet} from "react-router-dom";
import AssistantIcon from "./icons/Assistant";


function App() {
    const [expanded, setExpanded] = useState(false)
    const [open, setOpen] = useState(false)
    if (open) {

        return <div
            className={`flex  flex-col h-[75vh] min-w-[400px] transition-all ease-in-out ${expanded ? "w-1/2" : "w-1/3"} fixed right-0 bottom-0 m-8 bg-white rounded-xl overflow-hidden shadow-xl`}
        >
            <Header
                setExpanded={() => setExpanded(!expanded)}
                expanded={expanded}
                close={() => setOpen(false)}
            />
            <div id={'content'} className={'relative h-full overflow-hidden'}>
                <Outlet/>
            </div>
            <div id={'footer'}></div>
        </div>
    }
    return (
        <div onClick={()=> setOpen(true)} className={'bg-accent-900 hover:cursor-pointer transition-all rounded-full h-14 w-14 flex items-center justify-center fixed right-0 bottom-0 m-8'}>
           <AssistantIcon width={35} height={35} fill={'white'} /> 
        </div>
    );
}

export default App;

