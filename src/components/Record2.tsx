import { useState, useEffect } from "react";
import StatsBox from "../assi/StatsBox"; // 통계 박스 컴포넌트 불러오기

export default function Record2() {
  document.body.style.margin = "0px";
  document.body.style.backgroundColor = "#9EDF9C";

  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트가 사라지면 타이머 정리
  }, []);

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "280px",
          height: "80px",
          backgroundColor: "#FFFFFF",
          marginBottom: "5px", // 첫 번째 박스 아래 여백
          display: "flex",
          justifyContent: "center",
          alignItems: "center", // 수직 & 수평 가운데 정렬
        }}
      >
        <h3>돌아가기</h3>
      </div>

      <div
        style={{
          width: "280px",
          height: "705px",
          backgroundColor: "#FFFFFF",
          display: "flex",
          flexDirection: "column", // 세로 정렬 적용
          alignItems: "center",
        }}
      >
        <h2 style={{ marginTop: "50px" }}>낱말연습</h2>
        <img
          src="/imges/user2.png"
          style={{ height: "110px", marginTop: "20px" }}
        />

        {/* 통계 박스 위치 조정 */}
        <div style={{ position: "relative", right: "40px" }}>
          <div>
            <StatsBox />
          </div>
        </div>
      </div>
    </div>
  );
}
