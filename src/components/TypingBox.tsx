export default function TypingBox() {
  return (
    <div
      style={{
        // background:"#E9E9E9",
        width: "1100px",
      }}
    >
      <div
        style={{
          width: "1030px",
          height: "120px",
          backgroundColor: "#FFFFFF",
          marginBottom: "3px",
          borderRadius: "10px",
        }}
      >
        <p
          style={{
            fontSize: "20px",
            marginLeft: "30px",
            position: "relative", // 상대적으로 위치 설정 해두는 코드
            top: "20px",
          }}
        >
          public class Main{"{"}
        </p>{" "}
        {/* '{' 쓸 때는 <- 저렇게... */}
        <hr
          style={{
            border: "none",
            backgroundColor: "#E9E9E9",
            width: "1000px",
            position: "relative",
            top: "9px",
            height: "4px",
          }}
        ></hr>
        <input
          type="text"
          style={{
            fontSize: "20px",
            border: "thick solid #FFFFFF",
            marginLeft: "25px",
            width: "900px",
            marginTop: "7px",
          }}
        />
      </div>
      <div
        style={{
          width: "1030px",
          height: "120px",
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
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
    </div>
  );
}
