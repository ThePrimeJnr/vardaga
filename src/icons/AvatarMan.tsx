import {SVGProps} from "react";

function AvatarManIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800"
            height="800"
            viewBox="0 0 36 36"
            {...props}
        >
            <path
                d="M18 17a7 7 0 10-7-7 7 7 0 007 7zm0-12a5 5 0 11-5 5 5 5 0 015-5z"
                className="clr-i-outline clr-i-outline-path-1"
            ></path>
            <path
                d="M30.47 24.37a17.16 17.16 0 00-24.93 0A2 2 0 005 25.74V31a2 2 0 002 2h22a2 2 0 002-2v-5.26a2 2 0 00-.53-1.37zM29 31H7v-5.27a15.17 15.17 0 0122 0z"
                className="clr-i-outline clr-i-outline-path-2"
            ></path>
            <path fill="none" d="M0 0H36V36H0z"></path>
        </svg>
    );
}

export default AvatarManIcon;