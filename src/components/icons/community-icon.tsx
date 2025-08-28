import { SVGProps } from "react";

export function CommunityIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M3 20V4h18v12H7l-4 4Zm2-2h12V6H5v12Zm0 0V6v12Z"
      ></path>
    </svg>
  );
}
