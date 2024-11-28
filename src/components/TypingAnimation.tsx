import React from 'react';

const TypingAnimation = () => {
    return (
        <div className="flex space-x-2 p-3 bg-white/80 rounded-xl w-16 ml-12">
            <div className="w-2 h-2 bg-accent-900 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-accent-900 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-accent-900 rounded-full animate-bounce"></div>
        </div>
    );
};

export default TypingAnimation; 