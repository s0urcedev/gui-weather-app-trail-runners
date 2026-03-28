import type { IconProps } from "./types";

export default function CalWithTickIcon({
    size = 30,
    strokeWidth = 2.5,
    className,
}: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 28 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M14.5833 26.5833H3.91667C2.44391 26.5833 1.25 25.3895 1.25 23.9167V11.9167M1.25 11.9167H25.25M1.25 11.9167V6.58333C1.25 5.11057 2.44391 3.91667 3.91667 3.91667H6.58333M25.25 11.9167V18.5833M25.25 11.9167V6.58333C25.25 5.11057 24.0561 3.91667 22.5833 3.91667H21.9167M17.25 3.91667V1.25M17.25 3.91667V6.58333M17.25 3.91667H11.25M6.58333 1.25V6.58333M18.5833 25.25L21.25 27.9167L26.5833 22.5833"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}