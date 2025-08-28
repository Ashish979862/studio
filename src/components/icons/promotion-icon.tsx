import { SVGProps } from "react";

export function PromotionIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M18 9h-2V7h2v2Zm-4 0h-2V7h2v2Zm-4 0H8V7h2v2Zm8-5H6v2H4v12h5v2h6v-2h5V6h-2V4Zm-2 14H8V6h8v12Z"
      ></path>
    </svg>
  );
}
