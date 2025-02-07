import React from "react";
import RobotIcon from "../icons/Robot";

const TypingAnimation = () => {
  return (
    <div className="w-full flex items-center mb-4 transform transition-all duration-300 hover:translate-x-1 ">
      <div className="flex items-center mb-2 space-x-2 animate-fade-in">
        <div className="p-2 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
          <RobotIcon
            width={24}
            height={24}
            className="text-gray-500/60 animate-pulse"
          />
        </div>
        <div className="text-sm font-medium text-gray-700">Svardaga</div>
      </div>
      <div className="flex space-x-2 p-3 bg-white/80 rounded-xl w-16 ml-12 bg-gray-200">
        <div className="w-2 h-2 bg-gray-500/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-500/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-500/60 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default TypingAnimation;
