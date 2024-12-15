import {SVGProps} from "react";

function Square(props: SVGProps<SVGSVGElement>) {
    return (
        <svg 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            {...props}
        >
            <rect 
                x="6" 
                y="6" 
                width="12" 
                height="12" 
                rx="2" 
                fill="currentColor"
            />
        </svg>
    );
}

export default Square;