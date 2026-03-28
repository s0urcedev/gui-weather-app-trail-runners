import type { IconProps } from "./types";

export default function ProfileIcon({
    size = 30,
    strokeWidth = 2.5,
    className,
}: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path
                d="M4.27783 23.0443C4.27783 23.0443 7.24986 19.25 14.5832 19.25C21.9165 19.25 24.8886 23.0443 24.8886 23.0443M14.5833 1.25001C7.21953 1.25001 1.25 7.21954 1.25 14.5833C1.25 21.9471 7.21953 27.9167 14.5833 27.9167C21.9471 27.9167 27.9167 21.9471 27.9167 14.5833C27.9167 7.21954 21.9471 1.25001 14.5833 1.25001ZM14.5833 14.5833C16.7925 14.5833 18.5833 12.7925 18.5833 10.5833C18.5833 8.37421 16.7925 6.58334 14.5833 6.58334C12.3741 6.58334 10.5833 8.37421 10.5833 10.5833C10.5833 12.7925 12.3741 14.5833 14.5833 14.5833Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}