import { SVGProps } from "react";

export function EarnListIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M5 15V3h14v12h-6.5l-3.5 4l-3.5-4H5Zm2-2h10V5H7v8Zm0 0V5v8Z"
      ></path>
    </svg>
  );
}
