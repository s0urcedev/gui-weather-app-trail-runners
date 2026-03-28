import type { IconProps } from "./types";

export default function CloudWithSunIcon({
    size = 32,
    strokeWidth = 2,
    className,
}: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M7.66667 17.0002C5.44444 17.0002 1 18.3335 1 23.6669C1 29.0002 5.44444 30.3335 7.66667 30.3335H23.6667C25.8889 30.3335 30.3333 29.0002 30.3333 23.6669C30.3333 18.3335 25.8889 17.0002 23.6667 17.0002M25 11.6666H26.3333M15.6666 2.33333V1M24.3332 4.33329L22.9999 5.66663M6.99967 4.33329L8.333 5.66663M5 11.6666H6.33333M15.6666 15.6668C17.8758 15.6668 19.6666 13.876 19.6666 11.6668C19.6666 9.45767 17.8758 7.6668 15.6666 7.6668C13.4574 7.6668 11.6666 9.45767 11.6666 11.6668C11.6666 13.876 13.4574 15.6668 15.6666 15.6668Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}