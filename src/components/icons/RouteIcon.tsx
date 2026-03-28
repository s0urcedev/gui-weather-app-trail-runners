import type { IconProps } from "./types";

export default function RouteIcon({
    size = 24,
    strokeWidth = 2.48204,
    className,
}: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M18.741 1.24102V18.116C18.741 20.5323 16.7822 22.4912 14.366 22.4912C11.9497 22.4912 9.99098 20.5324 9.99098 18.1162V6.86616C9.99098 4.44991 8.03222 2.49115 5.61597 2.49115C3.19972 2.49115 1.24097 4.4499 1.24097 6.86615V21.8661M18.741 1.24102L23.116 5.61602M18.741 1.24102L14.366 5.61602"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}