import type { IconProps } from "./types";

export default function BellIcon({
    size = 30,
    strokeWidth = 2.5,
    className,
}: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 27 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M15.5567 26.5833C15.3223 26.9875 14.9859 27.3229 14.5809 27.556C14.1761 27.7892 13.7172 27.912 13.25 27.912C12.7828 27.912 12.3239 27.7892 11.9191 27.556C11.5143 27.3229 11.1777 26.9875 10.9433 26.5833M21.25 9.78333C21.25 7.52015 20.4072 5.34967 18.9068 3.74936C17.4065 2.14904 15.3717 1.25 13.25 1.25C11.1283 1.25 9.09344 2.14904 7.59315 3.74936C6.09285 5.34967 5.25 7.52015 5.25 9.78333C5.25 19.7389 1.25 22.5833 1.25 22.5833H25.25C25.25 22.5833 21.25 19.7389 21.25 9.78333Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}