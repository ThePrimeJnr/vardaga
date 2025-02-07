import { SVGProps } from "react";

function ClearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1200"
      height="1200"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="none"
        stroke="white"
        strokeWidth="1"
        d="M19 7v13a2 2 0 01-2 2H7a2 2 0 01-2-2V7m3-3v-.5A1.5 1.5 0 019.5 2h5A1.5 1.5 0 0116 3.5V4m-8 0h8m4 0H4v3h16V4z"
      />
    </svg>
  );
}

export default ClearIcon;
