import React from "react";

const Avatar = ({ githubHandle, size, round, className }) => {
  return (
    <img
      src={`
        https://avatars.githubusercontent.com/${githubHandle}?size=${size}`}
      alt={githubHandle}
      className={round ? `rounded-circle ${className}` : className}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default Avatar;
