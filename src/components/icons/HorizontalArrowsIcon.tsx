import type { IconProps } from "./types";

export default function HorizontalArrowsIcon({
    size = 17,
    strokeWidth = 1.73684,
    className,
}: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 17 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M8.17993 4.92104H15.9213M15.9213 4.92104L12.2656 0.868408M15.9213 4.92104L12.2656 8.97367M8.61001 4.92104H0.868652M0.868652 4.92104L4.52429 0.868408M0.868652 4.92104L4.52429 8.97367"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
