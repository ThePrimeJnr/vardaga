import './App.css';
import { useState, useEffect } from "react";
import Header from "./components/Header";
import { Outlet, useLocation } from "react-router-dom";
import AssistantIcon from "./icons/Assistant";
import IntentSelection from './screens/IntentSelection';
import Chat from './screens/Chat';
import React from 'react';

function App() {
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);
    const [slideDirection, setSlideDirection] = useState('right');
    const location = useLocation();

    // Track route changes to determine slide direction
    useEffect(() => {
        setSlideDirection(location.pathname === '/chat' ? 'left' : 'right');
    }, [location.pathname]);

    if (open) {
        return (
            <div className={`
                fixed right-0 bottom-0 m-8 
                flex flex-col 
                h-[75vh] min-w-[400px] 
                ${expanded ? "w-1/2" : "w-1/3"} 
                bg-white rounded-xl overflow-hidden shadow-xl
                animate-slide-in
                transition-all duration-300 ease-in-out
            `}>
                <Header
                    setExpanded={() => setExpanded(!expanded)}
                    expanded={expanded}
                    close={() => setOpen(false)}
                />
                <div className="relative h-full overflow-hidden">
                    <div className={`
                        absolute inset-0 transition-transform duration-500 ease-in-out
                        ${slideDirection === 'left' ? '-translate-x-full' : 'translate-x-0'}
                    `}>
                        <div className="absolute inset-0">
                            <IntentSelection />
                        </div>
                    </div>
                    <div className={`
                        absolute inset-0 transition-transform duration-500 ease-in-out
                        ${slideDirection === 'left' ? 'translate-x-0' : 'translate-x-full'}
                    `}>
                        <div className="absolute inset-0">
                            <Chat />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setOpen(true)}
            className={`
                fixed right-0 bottom-0 m-8
                bg-accent-900 hover:bg-accent-800
                rounded-full h-14 w-14 
                flex items-center justify-center
                transition-all duration-300
                hover:scale-110 active:scale-95
                shadow-lg hover:shadow-xl
                animate-bounce-gentle
            `}
        >
            <AssistantIcon width={35} height={35} fill={'white'} />
        </button>
    );
}

export default App;

