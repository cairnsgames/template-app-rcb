import React from "react";

export function Pin({
  photoUrl = "person1.jpeg",
  width = 40,
  height = 40,
  ...rest
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 40 40" {...rest}>
      <defs>
        <clipPath id="circleView">
          <circle cx="20" cy="16" r="13" fill="#FFFFFF" />
        </clipPath>
      </defs>
      <path
        d="M20 0c-8.837 0-16 7.163-16 16 0 11.245 16 24 16 24s16-12.755 16-24c0-8.837-7.163-16-16-16zm0 22c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"
      />
      <image
        width="30"
        height="30"
        xlinkHref={photoUrl}
        clipPath="url(#circleView)"
		x="6"
		y="2"
      />
    </svg>
  );
}
