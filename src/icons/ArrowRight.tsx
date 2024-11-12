import {SVGProps} from "react";

function ArrowRight(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800"
            height="800"
            fill="none"
            viewBox="0 0 24 24"
            {...props}
        >
            <path
                fill="inherit"
                d="M16.315 16.668a1 1 0 101.415 1.414l4.665-4.665a2 2 0 000-2.829L17.727 5.92a1 1 0 10-1.415 1.414L19.978 11H2a1 1 0 100 2h17.983l-3.668 3.668z"
            ></path>
        </svg>
    );
}

export default ArrowRight;