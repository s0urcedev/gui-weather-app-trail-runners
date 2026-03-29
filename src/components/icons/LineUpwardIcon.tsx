import type { IconProps } from "./types";

export default function LineUpwardIcon({
    size = 17,
    strokeWidth = 1.73684,
    className,
}: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 17 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M0.868652 11.2895L8.63775 2.60525L11.5512 6.07893L15.9213 0.868408"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
