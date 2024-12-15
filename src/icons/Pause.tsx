import { SVGProps } from "react";

function PauseIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            {...props}
        >
            <path 
                d="M6 4h4v16H6zM14 4h4v16h-4z" 
                fill="currentColor" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default PauseIcon; 