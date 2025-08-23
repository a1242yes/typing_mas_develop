import { useState } from "react";

export default function Selest() {
  const [showOptions, setShowOptions] = useState(false); // 상태 추가코드임

  return (
    <div>
      <div
        style={{
          margin: "0",
          padding: "0",
          background: "#FFFFFF",
          height: "90px",
          width: "100vw",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="/imges/mirim.png"
          style={{ height: "80px", width: "80px", marginLeft: "60px" }}
        />

        <h3
          style={{ marginLeft: "40px", cursor: "pointer" }}
          onClick={() => setShowOptions(!showOptions)}
        >
          타자연습
        </h3>

        <img
          src="/imges/user.png"
          style={{ height: "55px", width: "55px", marginLeft: "1165px" }}
        />
      </div>

      {showOptions && (
        <div
          style={{
            background: "#FFFFFF",
            borderTop: "2.5px solid #CCCCCC",
            padding: "10px",
            width: "100vw",
            height: "50px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <h3 style={{ cursor: "pointer", marginLeft: "170px" }}>단어</h3>
          <h3 style={{ cursor: "pointer", marginLeft: "30px" }}>짧은 글</h3>
          <h3 style={{ cursor: "pointer", marginLeft: "30px" }}>긴 글</h3>
        </div>
      )}
    </div>
  );
}
