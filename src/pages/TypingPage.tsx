import KeyBode from "../components/KeyBode";
import Record2 from "../components/Record2";
import TypingBox from "../components/TypingBox";

export default function Typing() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <Record2 />
      <div
        style={{ marginLeft: "93px", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            marginTop: "10px",
            marginBottom: "30px",
            marginLeft: "30px",
          }}
        >
          <TypingBox />
        </div>
        <div>
          <KeyBode />
        </div>
      </div>
    </div>
  );
}
