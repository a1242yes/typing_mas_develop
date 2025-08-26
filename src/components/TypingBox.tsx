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
  const [totalErrors, setTotalErrors] = useState(0); // 누적 오타 수
  const [totalCorrectChars, setTotalCorrectChars] = useState(0); // 누적 정확한 글자 수
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 100,
    timeElapsed: 0,
    errors: 0,
  });
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "checking"
  >("checking");

  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 백엔드 연결 확인
  const checkBackendConnection = async () => {
    try {
      setConnectionStatus("checking");
      const response = await fetch("http://localhost:3000/health", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setConnectionStatus("connected");
        return true;
      } else {
        setConnectionStatus("disconnected");
        return false;
      }
    } catch (error) {
      console.error("백엔드 연결 실패:", error);
      setConnectionStatus("disconnected");
      return false;
    }
  };

  // API에서 랜덤 텍스트 가져오기
  const fetchRandomText = async () => {
    const isConnected = await checkBackendConnection();

    if (isConnected) {
      try {
        const response = await fetch(
          "http://localhost:3000/typing/texts/random",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCurrentText(data);
          setCurrentLineIndex(0);
          setUserInput("");
          console.log("텍스트 가져오기 성공:", data);
          return;
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error("텍스트 가져오기 실패:", error);
      }
    }

    // API 실패 시 샘플 데이터 사용
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
        return self.result
    
    def multiply(self, value):
        self.result *= value
        return self.result`,
      },
    ];

    const randomText =
      sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setCurrentText(randomText);
    setCurrentLineIndex(0);
    setUserInput("");
    console.log("샘플 텍스트 사용:", randomText);
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

        // 현재 줄의 정확한 글자 수와 오타 수 계산
        const { correctChars: currentCorrectChars, errorCount: currentErrors } =
          calculateAccuracy(currentLine, userInput);

        // 전체 누적 정확한 글자 수 = 이전 줄들의 정확한 글자 + 현재 줄의 정확한 글자
        const totalCorrectNow = totalCorrectChars + currentCorrectChars;

        // WPM 계산
        const minutes = timeElapsed / 60;
        const effectiveMinutes = Math.max(minutes, 1 / 60);
        const wpm = Math.round(totalCorrectNow / 5 / effectiveMinutes);

        // 전체 입력한 글자 수 (이전 줄들 + 현재 줄)
        const totalTypedChars = getTotalTypedChars() + userInput.length;

        // 전체 정확도 계산
        const accuracy =
          totalTypedChars > 0
            ? Math.round((totalCorrectNow / totalTypedChars) * 100)
            : 100;

        // 현재까지의 총 오타 수
        const currentTotalErrors = totalErrors + currentErrors;

        setStats({
          wpm: wpm,
          accuracy: accuracy,
          timeElapsed: timeElapsed,
          errors: currentTotalErrors,
        });
      }, 100);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [
    isStarted,
    userInput,
    startTime,
    currentLineIndex,
    totalErrors,
    totalCorrectChars,
  ]);

  // 정확도와 오타 수 계산
  const calculateAccuracy = (targetLine: string, input: string) => {
    let correctChars = 0;
    let errorCount = 0;
    const inputLength = input.length;
    const targetLength = targetLine.length;

    for (let i = 0; i < Math.min(inputLength, targetLength); i++) {
      if (input[i] === targetLine[i]) {
        correctChars++;
      } else {
        errorCount++;
      }
    }

    return { correctChars, errorCount };
  };

  // 지금까지 입력한 총 글자 수 계산 (완료된 줄들의 길이 합)
  const getTotalTypedChars = () => {
    const lines = getLines();
    let total = 0;
    for (let i = 0; i < currentLineIndex; i++) {
      total += lines[i]?.length || 0;
    }
    return total;
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

    // 현재 줄 완료 체크 - 길이가 맞으면 넘어가기
    if (value.length === currentLine.length) {
      const lines = getLines();

      // 현재 줄의 최종 정확도 계산하여 누적값에 추가
      const { correctChars, errorCount } = calculateAccuracy(
        currentLine,
        value
      );
      setTotalCorrectChars((prev) => prev + correctChars);
      setTotalErrors((prev) => prev + errorCount);

      // 다음 줄로 이동
      if (currentLineIndex < lines.length - 1) {
        setTimeout(() => {
          setCurrentLineIndex(currentLineIndex + 1);
          setUserInput(""); // 입력 필드 초기화
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      } else {
        // 모든 줄 완료
        completeTyping();
      }
    }
  };

  // 타이핑 완료
  const completeTyping = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    // 결과 저장 시도
    if (connectionStatus === "connected") {
      try {
        const response = await fetch("http://localhost:3000/typing/results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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

        if (response.ok) {
          console.log("결과 저장 성공");
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error("결과 저장 실패:", error);
      }
    }

    alert(
      `완료!\nWPM: ${stats.wpm}\n정확도: ${stats.accuracy}%\n총 오타 수: ${stats.errors}개\n소요 시간: ${stats.timeElapsed}초`
    );
  };

  // 다시 시작
  const restart = () => {
    setUserInput("");
    setCurrentLineIndex(0);
    setIsStarted(false);
    setStartTime(null);
    setTotalErrors(0); // 누적 오타 수 초기화
    setTotalCorrectChars(0); // 누적 정확한 글자 수 초기화
    setStats({ wpm: 0, accuracy: 100, timeElapsed: 0, errors: 0 });
    fetchRandomText();
    if (inputRef.current) inputRef.current.focus();
  };

  // 텍스트 렌더링 (맞춤/틀림 표시)
  const renderCurrentLine = () => {
    const currentLine = getCurrentLine();
    if (!currentLine) return null;

    return currentLine.split("").map((char, index) => {
      let color = "#333"; // 기본 색상
      let backgroundColor = "transparent";

      if (index < userInput.length) {
        // 입력한 글자와 비교
        if (userInput[index] === char) {
          color = "#28a745"; // 초록색 (맞음)
        } else {
          color = "#dc3545"; // 빨간색 (틀림)
          backgroundColor = "#ffe6e6"; // 연한 빨간 배경
        }
      } else if (index === userInput.length) {
        // 현재 입력해야 할 글자 (커서 위치)
        backgroundColor = "#e3f2fd"; // 연한 파란 배경
      }

      return (
        <span
          key={index}
          style={{
            color: color,
            backgroundColor: backgroundColor,
            padding: "1px",
          }}
        >
          {char}
        </span>
      );
    });
  };

  // 연결 상태 표시 색상
  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "#4CAF50";
      case "disconnected":
        return "#f44336";
      case "checking":
        return "#ff9800";
      default:
        return "#666";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "백엔드 연결됨";
      case "disconnected":
        return "백엔드 연결 안됨 (샘플 데이터 사용)";
      case "checking":
        return "연결 확인 중...";
      default:
        return "알 수 없음";
    }
  };

  return (
    <div style={{ width: "1100px" }}>
      {/* 연결 상태 표시 - 연결됐을 때만 간단히 표시 */}
      {connectionStatus === "connected" && (
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
        <span>총 오타: {stats.errors}</span>
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

      {/* 현재 텍스트 제목 */}
      {currentText && (
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
      )}

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
