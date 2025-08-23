import { useState } from "react";
export default function KeyButton1(props: any) {
  return (
    <button
      style={{
        width: "60px",
        height: "65px",
        backgroundColor: props.backgroundColor,
        fontSize: "15px",
        borderRadius: "6px",
        border: "1px solid #000000",
        marginRight: props.marginRight || "0px", // margin이 전달되지 않으면 기본값으로 0px
      }}
    >
      <a
        style={{ textDecoration: "none", color: props.labelColor || "#FFFFFF" }}
      >
        {props.label}
      </a>
    </button>
  );
}
