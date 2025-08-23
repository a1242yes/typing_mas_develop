export default function Rt_ranking() {
  document.body.style.backgroundColor = "#FFFFFF"; // 배경색 설정

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // 세로 정렬
        justifyContent: "center", // 가로 중앙 정렬
        alignItems: "center", // 세로 중앙 정렬
        height: "100vh",
      }}
    >
      <img
        src="/imges/mirim.png"
        style={{
          height: "80px",
          width: "80px",
          marginBottom: "20px",
        }}
      />

      <div
        style={{
          height: "400px",
          width: "550px",
          background: "#9EDF9C",
          display: "flex", // 내부 요소 정렬 가능하게 설정
          justifyContent: "center", // 가로 중앙 정렬
          alignItems: "center", // 세로 중앙 정렬
        }}
      >
        <div
          style={{
            height: "50px",
            width: "350px",
            background: "#FFFFFF",
            borderRadius: "10px",
            display: "flex", // 가로 정렬을 위해 flex 추가
            alignItems: "center", // 세로 중앙 정렬
            justifyContent: "center", // 내부 요소 가운데 정렬
            gap: "10px", // 이미지와 글자 사이 간격 추가
          }}
        >
          <img
            src="/imges/google.png"
            style={{
              height: "20px",
              width: "20px",
            }}
          />
          <p style={{ fontSize: "14px", fontWeight: "bold" }}>
            Google계정으로 시작하기
          </p>
        </div>
      </div>
    </div>
  );
}
