import { SVGProps } from "react";

function DownloadIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M12 15V3m0 12l-4-4m4 4l4-4m4 4v3a2 2 0 01-2 2H6a2 2 0 01-2-2v-3"
      />
    </svg>
  );
}

export default DownloadIcon;