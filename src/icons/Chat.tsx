import { SVGProps } from "react";
function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1"
      viewBox="0 0 64 64"
      xmlSpace="preserve"
      {...props}
    >
      <path
        fill="#F9EBB2"
        d="M62 44a2 2 0 01-2 2H29.499c-1.041 0-1.791.791-1.791.791L14 60.5V47a1 1 0 00-1-1H4a2 2 0 01-2-2V4a2 2 0 012-2h56a2 2 0 012 2v40z"
      ></path>
      <path
        fill="#394240"
        d="M60 0H4C1.789 0 0 1.789 0 4v40c0 2.211 1.789 4 4 4h8v15a.999.999 0 001.707.707L29.414 48H60c2.211 0 4-1.789 4-4V4c0-2.211-1.789-4-4-4zm2 44a2 2 0 01-2 2H29.499c-1.041 0-1.791.791-1.791.791L14 60.5V47a1 1 0 00-1-1H4a2 2 0 01-2-2V4a2 2 0 012-2h56a2 2 0 012 2v40z"
      ></path>
      <path
        fill="#394240"
        d="M15 16h16a1 1 0 100-2H15a1 1 0 100 2zM49 20H15a1 1 0 100 2h34a1 1 0 100-2zM15 28h24a1 1 0 100-2H15a1 1 0 100 2zM45 32H15a1 1 0 100 2h30a1 1 0 100-2z"
      ></path>
    </svg>
  );
}

export default ChatIcon;
