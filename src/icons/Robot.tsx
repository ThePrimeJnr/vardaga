import { SVGProps } from "react";

function RobotIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="800"
      height="800"
      fill="#000"
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="M200 52h-68V16a4 4 0 00-8 0v36H56a28.031 28.031 0 00-28 28v112a28.031 28.031 0 0028 28h144a28.031 28.031 0 0028-28V80a28.031 28.031 0 00-28-28zm20 140a20.023 20.023 0 01-20 20H56a20.023 20.023 0 01-20-20V80a20.023 20.023 0 0120-20h144a20.023 20.023 0 0120 20zm-56-52H92a24 24 0 000 48h72a24 24 0 000-48zm-20 8v32h-32v-32zm-68 16a16.018 16.018 0 0116-16h12v32H92a16.018 16.018 0 01-16-16zm88 16h-12v-32h12a16 16 0 010 32zm-88-72a8 8 0 118 8 8 8 0 01-8-8zm88 0a8 8 0 118 8 8 8 0 01-8-8z"></path>
    </svg>
  );
}

export default RobotIcon;
