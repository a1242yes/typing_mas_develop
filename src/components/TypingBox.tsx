import React, { useState, useEffect, useRef } from "react";

interface TypingText {
  id: string;
  title: string;
  content: string;
}

export default function TypingBox() {
  // 상태 관리
  const [currentText, setCurrentText] = useState<TypingText | null>(null);
  const [userInput, setUserInput] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    timeElapsed: 0,
    errors: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // API에서 랜덤 텍스트 가져오기
  const fetchRandomText = async () => {
    try {
      const response = await fetch("http://localhost:3000/typing/texts/random");
      const data = await response.json();
      setCurrentText(data);
      setCurrentLineIndex(0);
      setUserInput("");
    } catch (error) {
      console.error("텍스트 가져오기 실패:", error);
      // API가 안될 때 임시 데이터
      setCurrentText({
        id: "1",
        title: "Sample Code",
        content: `public class Main {
  public static void main(String[] args) {
    int a = 1; int b = 2; int c = 3;
    System.out.println(a + b + c);
  }
}`,
      });
    }
  };

  // 컴포넌트 마운트 시 텍스트 가져오기
  useEffect(() => {
    fetchRandomText();
  }, []);

  // 텍스트를 줄 단위로 분할
  const getLines = () => {
    if (!currentText) return [];
    return currentText.content.split("\n");
  };

  // 현재 쳐야 할 줄 가져오기
  const getCurrentLine = () => {
    const lines = getLines();
    return lines[currentLineIndex] || "";
  };

  // 앞으로 쳐야 할 줄들 가져오기 (최대 3줄)
  const getUpcomingLines = () => {
    const lines = getLines();
    return lines.slice(currentLineIndex + 1, currentLineIndex + 4);
  };

  // 실시간 통계 업데이트
  useEffect(() => {
    if (isStarted && startTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const timeElapsed = Math.floor(
          (now.getTime() - startTime.getTime()) / 1000
        );
        const currentLine = getCurrentLine();

        // WPM 계산
        const minutes = timeElapsed / 60;
        const correctChars = calculateCorrectChars(currentLine);
        const wpm = minutes > 0 ? Math.round(correctChars / 5 / minutes) : 0;

        // 정확도 계산
        const accuracy =
          userInput.length > 0
            ? Math.round((correctChars / userInput.length) * 100)
            : 100;

        // 오타 개수
        const errors = userInput.length - correctChars;

        setStats({
          wpm: wpm,
          accuracy: accuracy,
          timeElapsed: timeElapsed,
          errors: errors,
        });
      }, 100);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isStarted, userInput, startTime, currentLineIndex]);

  // 정확한 글자 수 계산
  const calculateCorrectChars = (targetLine: string): number => {
    let correct = 0;
    for (let i = 0; i < Math.min(userInput.length, targetLine.length); i++) {
      if (userInput[i] === targetLine[i]) {
        correct++;
      }
    }
    return correct;
  };

  // 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // 시작하지 않았으면 시작
    if (!isStarted) {
      setIsStarted(true);
      setStartTime(new Date());
    }

    setUserInput(value);

    const currentLine = getCurrentLine();

    // 현재 줄 완료 체크
    if (value === currentLine) {
      const lines = getLines();

      // 다음 줄로 이동
      if (currentLineIndex < lines.length - 1) {
        setCurrentLineIndex(currentLineIndex + 1);
        setUserInput("");
        if (inputRef.current) inputRef.current.focus();
      } else {
        // 모든 줄 완료
        completeTyping();
      }
    }
  };

  // 타이핑 완료
  const completeTyping = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    // 결과 저장
    try {
      await fetch("http://localhost:3000/typing/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textId: currentText?.id || "",
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          totalTime: stats.timeElapsed,
          totalCharacters: currentText?.content.length || 0,
          correctCharacters: currentText?.content.length || 0,
        }),
      });
    } catch (error) {
      console.error("결과 저장 실패:", error);
    }

    alert(`완료! WPM: ${stats.wpm}, 정확도: ${stats.accuracy}%`);
  };

  // 다시 시작
  const restart = () => {
    setUserInput("");
    setCurrentLineIndex(0);
    setIsStarted(false);
    setStartTime(null);
    setStats({ wpm: 0, accuracy: 100, timeElapsed: 0, errors: 0 });
    fetchRandomText();
    if (inputRef.current) inputRef.current.focus();
  };

  // 텍스트 렌더링 (맞춤/틀림 표시)
  const renderCurrentLine = () => {
    const currentLine = getCurrentLine();
    if (!currentLine) return null;

    return currentLine.split("").map((char, index) => {
      let color = "";
      if (index < userInput.length) {
        color = userInput[index] === char ? "green" : "red";
      }

      return (
        <span key={index} style={{ color: color }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div style={{ width: "1100px" }}>
      {/* 통계 표시 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        <span>WPM: {stats.wpm}</span>
        <span>정확도: {stats.accuracy}%</span>
        <span>시간: {stats.timeElapsed}s</span>
        <span>오타: {stats.errors}</span>
        <button
          onClick={restart}
          style={{
            padding: "5px 10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          새로 시작
        </button>
      </div>

      {/* 현재 쳐야 할 문장 */}
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
            position: "relative",
            top: "20px",
            fontFamily: "monospace",
          }}
        >
          {renderCurrentLine()}
        </p>
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
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          style={{
            fontSize: "20px",
            border: "thick solid #FFFFFF",
            marginLeft: "25px",
            width: "900px",
            marginTop: "7px",
            fontFamily: "monospace",
          }}
          placeholder="여기에 타이핑하세요..."
          autoFocus
        />
      </div>

      {/* 앞으로 쳐야 할 내용 미리보기 */}
      <div
        style={{
          width: "1030px",
          minHeight: "120px",
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <div
          style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "10px",
          }}
        >
          다음 내용:
        </div>
        {getUpcomingLines().map((line, index) => (
          <p
            key={index}
            style={{
              fontSize: "18px",
              marginLeft: "10px",
              marginBottom: "5px",
              fontFamily: "monospace",
              color: "#888",
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
