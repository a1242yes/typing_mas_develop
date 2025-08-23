export default function Result() {
  document.body.style.margin = "0px";
  return (
    <div>
      <div
        style={{
          width: "860px",
          height: "500px",
          backgroundColor: "#2C2F39",
          padding: "20px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex" }}>
          <h3
            style={{ color: "#FFFFFF", marginLeft: "10px", marginTop: "10px" }}
          >
            결과 : 2월 17일 11:02:44
          </h3>
        </div>

        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "250px",
          }}
        >
          <h2 style={{ color: "#FFFFFF" }}>
            ------------------------------------------------------
          </h2>
          <h3 style={{ color: "#FFFFFF" }}>진행시간: 10분</h3>
          <h3 style={{ color: "#FFFFFF" }}>타수(타/분): 600</h3>
          <h3 style={{ color: "#FFFFFF" }}>정확도: 100%</h3>
        </div>
        <img
          src="/imges/mirim3.png"
          style={{ height: "180px", marginTop: "10px" }}
        />
        <h3 style={{ color: "#FFFFFF" }}>(userName) ~ % javac mirim.java</h3>
        <h3 style={{ color: "#FFFFFF" }}>(userName) ~ % java mirim</h3>
        <h3 style={{ color: "#FFFFFF" }}>10</h3>
        <h3 style={{ color: "#FFFFFF" }}>(userName) ~ % </h3>
      </div>
    </div>
  );
}
