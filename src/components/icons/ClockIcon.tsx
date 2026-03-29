import type { IconProps } from "./types";

export default function ClockIcon({
    size = 14,
    strokeWidth = 1.73684,
    className,
}: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M6.23687 4.55262V6.86841H8.55266M6.65813 12.4474C9.85554 12.4474 12.4476 9.85529 12.4476 6.65788C12.4476 3.46044 9.85554 0.868408 6.65813 0.868408C3.46069 0.868408 0.868652 3.46044 0.868652 6.65788C0.868652 9.85529 3.46069 12.4474 6.65813 12.4474Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
