import { useState, useEffect } from "react";
import KeyButton1 from "../assi/KeyButton1";
import KeyButton2 from "../assi/KeyButton2";
export default function Keybode() {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toUpperCase();
    const buttons = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "0",
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P",
      "[",
      "]",
      "{",
      "}",
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      ";",
      ":",
      "'",
      '"',
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      ",",
      ".",
      "<",
      ">",
      "/",
      " ",
      "?",
    ];

    if (buttons.includes(key)) {
      setActiveButton(key);

      setTimeout(() => {
        setActiveButton(null);
      }, 1000);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      style={{
        width: "1100px",
        height: "450px",
        overflow: "auto",
        backgroundColor: "#FFFFFF",
        borderRadius: "10px",
        borderColor: "#000000",
      }}
    >
      <div>
        <hr
          style={{
            border: "none",
            backgroundColor: "#E9E9E9",
            width: "1050px",
            position: "relative",
            top: "17px",
            height: "10px",
            borderRadius: "20px",
          }}
        ></hr>
      </div>
      <div
        style={{
          marginTop: "37px",
          marginLeft: "21px",
        }}
      >
        <KeyButton2
          label="단어"
          backgroundColor="#FFFFFF"
          width="120px"
          marginRight="9px"
        />
        <KeyButton1
          label="1"
          backgroundColor={activeButton === "1" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="2"
          backgroundColor={activeButton === "2" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="3"
          backgroundColor={activeButton === "3" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="4"
          backgroundColor={activeButton === "4" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="5"
          backgroundColor={activeButton === "5" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="6"
          backgroundColor={activeButton === "6" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="7"
          backgroundColor={activeButton === "7" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="8"
          backgroundColor={activeButton === "8" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="9"
          backgroundColor={activeButton === "9" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="0"
          backgroundColor={activeButton === "0" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1 label="단어" backgroundColor="#FFFFFF" marginRight="9px" />
        <KeyButton1 label="단어" backgroundColor="#FFFFFF" marginRight="9px" />
        <KeyButton2 label="단어" backgroundColor="#FFFFFF" width="95px" />
      </div>
      <div
        style={{
          marginTop: "9px",
          marginLeft: "21px",
        }}
      >
        <KeyButton2
          label="단어"
          backgroundColor="#FFFFFF"
          width="107px"
          marginRight="9px"
        />
        <KeyButton1
          label="Q"
          backgroundColor={activeButton === "Q" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="W"
          backgroundColor={activeButton === "W" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="E"
          backgroundColor={activeButton === "E" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="R"
          backgroundColor={activeButton === "R" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="T"
          backgroundColor={activeButton === "T" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="Y"
          backgroundColor={activeButton === "Y" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="U"
          backgroundColor={activeButton === "U" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="I"
          backgroundColor={activeButton === "I" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="O"
          backgroundColor={activeButton === "O" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="P"
          backgroundColor={activeButton === "P" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="{"
          backgroundColor={
            activeButton === "[" || activeButton === "{" ? "#00C281" : "#008156"
          }
          marginRight="9px"
        />
        <KeyButton1
          label="}"
          backgroundColor={
            activeButton === "]" || activeButton === "}" ? "#00C281" : "#008156"
          }
          marginRight="9px"
        />
        <KeyButton2 label="단어" backgroundColor="#FFFFFF" width="107px" />
      </div>
      <div
        style={{
          marginTop: "9px",
          marginLeft: "21px",
        }}
      >
        <KeyButton2
          label="단어"
          backgroundColor="#FFFFFF"
          width="142px"
          marginRight="9px"
        />
        <KeyButton1
          label="A"
          backgroundColor={activeButton === "A" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="S"
          backgroundColor={activeButton === "S" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="D"
          backgroundColor={activeButton === "D" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="F"
          backgroundColor={activeButton === "F" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="G"
          backgroundColor={activeButton === "G" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="H"
          backgroundColor={activeButton === "H" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="J"
          backgroundColor={activeButton === "J" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="K"
          backgroundColor={activeButton === "K" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="L"
          backgroundColor={activeButton === "L" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label=":  ;"
          backgroundColor={
            activeButton === ";" || activeButton === ":" ? "#00C281" : "#008156"
          }
          marginRight="9px"
        />
        <KeyButton1
          label={`"  '`}
          backgroundColor={
            activeButton === '"' || activeButton === "'" ? "#00C281" : "#008156"
          }
          marginRight="9px"
        />
        <KeyButton2 label="단어" backgroundColor="#FFFFFF" width="142px" />
      </div>
      <div
        style={{
          marginTop: "9px",
          marginLeft: "21px",
        }}
      >
        <KeyButton2
          label="없음"
          backgroundColor="#FFFFFF"
          width="176px"
          marginRight="9px"
        />
        <KeyButton1
          label="Z"
          backgroundColor={activeButton === "Z" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="X"
          backgroundColor={activeButton === "X" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="C"
          backgroundColor={activeButton === "C" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="V"
          backgroundColor={activeButton === "V" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="B"
          backgroundColor={activeButton === "B" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="N"
          backgroundColor={activeButton === "N" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="M"
          backgroundColor={activeButton === "M" ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="<  ,"
          backgroundColor={
            activeButton === "," || activeButton === "<" ? "#00C281" : "#008156"
          }
          marginRight="9px"
        />
        <KeyButton1
          label=">  ."
          backgroundColor={activeButton === "." ? "#00C281" : "#008156"}
          marginRight="9px"
        />
        <KeyButton1
          label="?  /"
          backgroundColor={
            activeButton === "/" || activeButton === "?" ? "#00C281" : "#008156"
          }
          marginRight="9px"
        />
        <KeyButton2 label="단어" backgroundColor="#FFFFFF" width="177px" />
      </div>
      <div
        style={{
          marginTop: "9px",
          marginLeft: "21px",
        }}
      >
        <KeyButton2
          label="단어"
          backgroundColor="#FFFFFF"
          width="75px"
          marginRight="9px"
        />
        <KeyButton2
          label="단어"
          backgroundColor="#FFFFFF"
          width="75px"
          marginRight="9px"
        />
        <KeyButton2
          label="단어"
          backgroundColor="#FFFFFF"
          width="75px"
          marginRight="9px"
        />
        <KeyButton2
          label="SPACE"
          backgroundColor={activeButton === " " ? "#00C281" : "#008156"}
          marginRight="9px"
          width="460px"
          labelColor="#008156"
        />
        <KeyButton2
          label="단어"
          backgroundColor="#FFFFFF"
          width="75px"
          marginRight="9px"
        />
        <KeyButton2
          label="단어"
          backgroundColor="#FFFFFF"
          width="60px"
          marginRight="9px"
        />
        <KeyButton2 label="단어" backgroundColor="#FFFFFF" width="178px" />
      </div>
    </div>
  );
}
