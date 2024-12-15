import { SVGProps } from "react";

function TrashIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            {...props}
        >
            <path 
                d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" 
                strokeWidth={2} 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default TrashIcon; 