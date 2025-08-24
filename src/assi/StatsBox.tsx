import { useState, useEffect } from "react";
import TypingBox from "../components/TypingBox";
export default function StatsBox() {
  document.body.style.margin = "0px";

  const [time, setTime] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div>
      <div
        style={{
          marginTop: "100px",
          border: "2px solid black",
          backgroundColor: "white",
          color: "black",
          padding: "16px",
          fontSize: "1.25rem",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "10px",
          width: "40px",
          borderLeft: "none",
          position: "relative",
          left: "40px",
        }}
      >
        통계
      </div>
      <hr
        style={{
          backgroundColor: "#000000",
          width: "157px",
          height: "1.5px",
          border: "none",
          position: "relative",
          left: "77px",
          bottom: "9px",
        }}
      ></hr>

      <div
        style={{
          marginTop: "20px",
          color: "black",
          fontSize: "1.25rem",
          fontWeight: "bold",
          borderBottom: "none",
          position: "relative",
          left: "40px",
          display: "flex",
        }}
      >
        진행상황{" "}
        <div style={{ position: "relative", left: "95px" }}>
          {minutes}:{seconds}
        </div>
      </div>
      <hr
        style={{
          marginTop: "20px",
          backgroundColor: "#000000",
          width: "230px",
          height: "1.5px",
          border: "none",
          position: "relative",
          left: "40px",
          bottom: "9px",
        }}
      ></hr>

      <div
        style={{
          marginTop: "20px",
          color: "black",
          fontSize: "1.25rem",
          fontWeight: "bold",
          borderBottom: "none",
          position: "relative",
          left: "40px",
          display: "flex",
        }}
      >
        타수(타/분) <div style={{ position: "relative", left: "112px" }}>3</div>
      </div>
      <hr
        style={{
          marginTop: "20px",
          backgroundColor: "#000000",
          width: "230px",
          height: "1.5px",
          border: "none",
          position: "relative",
          left: "40px",
          bottom: "9px",
        }}
      ></hr>

      <div
        style={{
          marginTop: "20px",
          color: "black",
          fontSize: "1.25rem",
          fontWeight: "bold",
          borderBottom: "none",
          position: "relative",
          left: "40px",
          display: "flex",
        }}
      >
        정확도(%){" "}
        <div style={{ position: "relative", left: "85px" }}>98.00</div>
      </div>
      <hr
        style={{
          marginTop: "20px",
          backgroundColor: "#E9E9E9",
          width: "205px",
          height: "5px",
          border: "none",
          position: "relative",
          left: "40px",
          bottom: "9px",
          borderRadius: "5px",
        }}
      ></hr>
    </div>
  );
}
