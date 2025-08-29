import React, { useState, useEffect, useRef } from "react";

interface TypingText {
  id: string;
  title: string;
  content: string;
}

interface Stats {
  wpm: number;
  accuracy: number;
  timeElapsed: number;
  errors: number;
}

export default function TypingBox() {
  // 상태 관리
  const [currentText, setCurrentText] = useState<TypingText | null>(null);
  const [userInput, setUserInput] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [totalErrors, setTotalErrors] = useState(0); // 오타 수정: setTotnpalErrors -> setTotalErrors
  const [totalCorrectChars, setTotalCorrectChars] = useState(0);
  const [stats, setStats] = useState<Stats>({
    wpm: 0,
    accuracy: 100,
    timeElapsed: 0,
    errors: 0,
  });
  const [isConnected, setIsConnected] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 샘플 텍스트 (주석 해제 및 정리)
  const sampleTexts = [
    {
      id: "sample-1",
      title: "Java Basic",
      content: `public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello World!");
        int number = 42;
        String text = "Java Programming";
    }
}`,
    },
    {
      id: "sample-2",
      title: "JavaScript Function",
      content: `function calculateSum(a, b) {
    const result = a + b;
    console.log('Sum:', result);
    return result;
}

const numbers = [1, 2, 3, 4, 5];
const total = numbers.reduce((sum, num) => sum + num, 0);`,
    },
    {
      id: "sample-3",
      title: "Python Class",
      content: `class Calculator:
    def __init__(self):
        self.result = 0

    def add(self, value):
        self.result += value
        return self.result`,
    },
  ];

  // 백엔드 연결 확인 및 텍스트 가져오기
  const fetchRandomText = async () => {
    try {
      const response = await fetch("http://localhost:3000/typing/texts/random");
      if (response.ok) {
        const data = await response.json();
        setCurrentText(data);
        setIsConnected(true);
        return;
      }
    } catch (error) {
      console.log("백엔드 연결 실패, 샘플 데이터 사용");
    }

    // API 실패 시 샘플 데이터 사용
    setIsConnected(false);
    const randomText =
      sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setCurrentText(randomText);
  };

  // 컴포넌트 마운트 시 텍스트 가져오기
  useEffect(() => {
    fetchRandomText();
  }, []);

  // 텍스트 처리 함수들
  const getLines = () => currentText?.content.split("\n") || [];
  const getCurrentLine = () => getLines()[currentLineIndex] || "";
  const getUpcomingLines = () =>
    getLines().slice(currentLineIndex + 1, currentLineIndex + 4);

  // 정확도 계산
  const calculateAccuracy = (targetLine: string, input: string) => {
    let correctChars = 0;
    let errorCount = 0;

    for (let i = 0; i < Math.min(input.length, targetLine.length); i++) {
      if (input[i] === targetLine[i]) {
        correctChars++;
      } else {
        errorCount++;
      }
    }
    return { correctChars, errorCount };
  };

  // 총 타이핑 글자 수 계산
  const getTotalTypedChars = () => {
    const lines = getLines();
    let total = 0;
    for (let i = 0; i < currentLineIndex; i++) {
      total += lines[i]?.length || 0;
    }
    return total;
  };

  // 실시간 통계 업데이트
  useEffect(() => {
    if (!isStarted || !startTime) return;

    intervalRef.current = setInterval(() => {
      const timeElapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
      const currentLine = getCurrentLine();
      const { correctChars, errorCount } = calculateAccuracy(
        currentLine,
        userInput
      );

      const totalCorrectNow = totalCorrectChars + correctChars;
      const totalTypedChars = getTotalTypedChars() + userInput.length;

      const minutes = Math.max(timeElapsed / 60, 1 / 60);
      const wpm = Math.round(totalCorrectNow / 5 / minutes);
      const accuracy =
        totalTypedChars > 0
          ? Math.round((totalCorrectNow / totalTypedChars) * 100)
          : 100;

      setStats({
        wpm,
        accuracy,
        timeElapsed,
        errors: totalErrors + errorCount,
      });
    }, 100);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    isStarted,
    userInput,
    startTime,
    currentLineIndex,
    totalErrors,
    totalCorrectChars,
  ]);

  // 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!isStarted) {
      setIsStarted(true);
      setStartTime(new Date());
    }

    setUserInput(value);
    const currentLine = getCurrentLine();

    // 줄 완료 체크
    if (value.length === currentLine.length) {
      const { correctChars, errorCount } = calculateAccuracy(
        currentLine,
        value
      );
      setTotalCorrectChars((prev) => prev + correctChars);
      setTotalErrors((prev) => prev + errorCount);

      const lines = getLines();
      if (currentLineIndex < lines.length - 1) {
        setTimeout(() => {
          setCurrentLineIndex(currentLineIndex + 1);
          setUserInput("");
          inputRef.current?.focus();
        }, 100);
      } else {
        completeTyping();
      }
    }
  };

  // 타이핑 완료
  const completeTyping = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    // 결과 저장 시도
    if (isConnected) {
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
            correctCharacters: totalCorrectChars,
            totalErrors: stats.errors,
          }),
        });
      } catch (error) {
        console.error("결과 저장 실패:", error);
      }
    }

    alert(
      `완료!\nWPM: ${stats.wpm}\n정확도: ${stats.accuracy}%\n총 오타: ${stats.errors}개\n소요 시간: ${stats.timeElapsed}초`
    );
  };

  // 다시 시작
  const restart = () => {
    setUserInput("");
    setCurrentLineIndex(0);
    setIsStarted(false);
    setStartTime(null);
    setTotalErrors(0);
    setTotalCorrectChars(0);
    setStats({ wpm: 0, accuracy: 100, timeElapsed: 0, errors: 0 });

    // 인터벌 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    fetchRandomText();
    inputRef.current?.focus();
  };

  // 현재 줄 렌더링
  const renderCurrentLine = () => {
    const currentLine = getCurrentLine();
    if (!currentLine) return null;

    return currentLine.split("").map((char, index) => {
      let color = "#333";
      let backgroundColor = "transparent";

      if (index < userInput.length) {
        if (userInput[index] === char) {
          color = "#28a745"; // 맞음
        } else {
          color = "#dc3545"; // 틀림
          backgroundColor = "#ffe6e6";
        }
      } else if (index === userInput.length) {
        backgroundColor = "#e3f2fd"; // 커서 위치
      }

      return (
        <span key={index} style={{ color, backgroundColor, padding: "1px" }}>
          {char}
        </span>
      );
    });
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!currentText) {
    return (
      <div
        style={{
          width: "1100px",
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "#666",
        }}
      >
        텍스트를 불러오는 중...
      </div>
    );
  }

  return (
    <div style={{ width: "1100px" }}>
      {/* 연결 상태 */}
      {isConnected && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            fontSize: "12px",
            color: "#4CAF50",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#4CAF50",
              marginRight: "5px",
            }}
          />
          백엔드 연결됨
        </div>
      )}

      {/* 통계 */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "15px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        <div>WPM: {stats.wpm}</div>
        <div>정확도: {stats.accuracy}%</div>
        <div>시간: {stats.timeElapsed}초</div>
        <div>오타: {stats.errors}개</div>
      </div>

      {/* 텍스트 제목 */}
      <div
        style={{
          fontSize: "14px",
          color: "#666",
          marginBottom: "10px",
          fontWeight: "bold",
        }}
      >
        {currentText.title} ({currentLineIndex + 1}/{getLines().length}줄)
      </div>

      {/* 현재 타이핑 영역 */}
      <div
        style={{
          width: "1030px",
          height: "120px",
          backgroundColor: "#FFFFFF",
          marginBottom: "3px",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      >
        <p
          style={{
            fontSize: "20px",
            marginLeft: "30px",
            position: "relative",
            top: "20px",
            fontFamily: "monospace",
            wordBreak: "break-all",
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
            margin: "0 auto",
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInputChange}
          style={{
            fontSize: "20px",
            border: "none",
            outline: "none",
            marginLeft: "25px",
            width: "900px",
            marginTop: "7px",
            fontFamily: "monospace",
            backgroundColor: "transparent",
          }}
          placeholder="여기에 타이핑하세요..."
          autoFocus
        />
      </div>

      {/* 미리보기 */}
      <div
        style={{
          width: "1030px",
          minHeight: "120px",
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          padding: "20px",
          border: "1px solid #ddd",
          marginBottom: "15px",
        }}
      >
        <div style={{ fontSize: "16px", color: "#666", marginBottom: "10px" }}>
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
              wordBreak: "break-all",
            }}
          >
            {line || "\u00A0"} {/* 빈 줄 처리 */}
          </p>
        ))}
      </div>

      {/* 제어 버튼 */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={restart}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          다시 시작
        </button>
        <button
          onClick={fetchRandomText}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          새 텍스트
        </button>
      </div>
    </div>
  );
}
