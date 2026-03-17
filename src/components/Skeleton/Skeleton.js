import React from "react";
import "./Skeleton.scss";

const Skeleton = ({ width = "100%", height = "20px", circle = false, count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className={`skeleton ${circle ? "skeleton-circle" : ""}`}
          style={{
            width,
            height,
          }}
        />
      ))}
    </>
  );
};

export default Skeleton;
