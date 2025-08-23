import { useState, useEffect } from "react";
import KeyBode from "../components/KeyBode";

export default function KeybodeMainpage() {
  document.body.style.backgroundColor = "#9EDF9C";
  document.body.style.display = "flex";
  document.body.style.justifyContent = "center";
  document.body.style.alignItems = "center";
  document.body.style.height = "100vh";
  document.body.style.margin = "0";

  //타이머 부분 조금 더 활용, 숙지 하기
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer); // 컴포넌트가 사라지면 타이머 정리
  }, []);

  // 시간 포맷을 MM:SS 형식으로 변환
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: "200px",
            height: "640px",
            backgroundColor: "#FFFFFF",
            position: "absolute",
            left: "50px", // 왼쪽으로 배치
            top: "50%",
            transform: "translateY(-50%)", //새로로 가운데
            borderRadius: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <h3
            style={{
              marginTop: "40px",
              alignItems: "center",
              textAlign: "center", // 가로로 가운데
            }}
          >
            낱말연습
          </h3>
          <h4
            style={{
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            진행시간 : {minutes}:{seconds}
          </h4>

          <div>
            <h4
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              전체
            </h4>
            <h4
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              평균타수 : 100
            </h4>
            <h4
              style={{
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              정확도 : 100.00%
            </h4>
          </div>
          <br></br>
          <div>
            <h4
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              현재
            </h4>
            <h4
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              최고타수 : 100
            </h4>
            <h4
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              평균타수 : 100
            </h4>
            <h4
              style={{
                textAlign: "center",
                marginTop: "10px",
              }}
            >
              정확도 : 40.00%
            </h4>

            <img
              src="/imges/mirim.png"
              alt="Description"
              style={{ height: "140px", width: "140px" }}
            />
          </div>
        </div>
        <div
          style={{
            borderLeft: "thick solid #FFFFFF",
            height: "630px",
            position: "absolute",
            left: "280px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        ></div>
      </div>

      {/* 🔥 입력 박스가 포함된 div를 위로 올림 */}
      <div
        style={{
          width: "1100px",
          height: "120px",
          backgroundColor: "#FFFFFF",
          marginTop: "-25px", // 박스 위쪽 위치 조정
          marginLeft: "277px",
          // marginBottom:"5px",
          borderRadius: "20px",
        }}
      >
        <p
          style={{
            fontSize: "20px",
            marginLeft: "30px",
            position: "relative", // 상대적으로 위치 설정 해두는 코드
            top: "24px",
          }}
        >
          public class Main{"{"}
        </p>{" "}
        {/* '{' 쓸 때는 <- 저렇게... */}
        <hr
          style={{
            border: "none",
            backgroundColor: "#E9E9E9",
            width: "1050px",
            position: "relative",
            top: "13px",
            height: "4px",
          }}
        ></hr>
        <input
          type="text"
          style={{
            fontSize: "20px",
            border: "thick solid #FFFFFF",
            marginLeft: "25px",
            width: "400px",
            marginTop: "11px",
          }}
        />
      </div>

      <div
        style={{
          width: "1100px",
          height: "120px",
          backgroundColor: "#FFFFFF",
          marginLeft: "277px",
          marginBottom: "20px",
          borderRadius: "20px",
        }}
      >
        <p
          style={{
            fontSize: "20px",
            marginLeft: "20px",
            position: "relative",
            top: "10px",
          }}
        >
          public static void main(String[] args){"{"}
        </p>
        <p
          style={{
            fontSize: "20px",
            marginLeft: "30px",
            position: "relative",
          }}
        >
          int a = 1; int b = 2; int c = 3;
        </p>
        <p
          style={{
            fontSize: "20px",
            marginLeft: "30px",
            position: "relative",
            bottom: "12px",
          }}
        >
          System.out.println(a + b + c);
        </p>
      </div>
      <div
        style={{
          marginLeft: "277px",
          position: "relative",
          top: "00px",
        }}
      >
        <KeyBode />
      </div>
    </div>
  );
}
