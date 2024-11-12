import {SVGProps} from "react";

function Square(props: SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24">
            <rect
                width="16"
                height="16"
                x="4"
                y="4"
                stroke="inherit"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                rx="2"
            ></rect>
        </svg>
    );
}

export default Square;