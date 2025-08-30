import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

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

interface TypingState {
  currentLineIndex: number;
  userInput: string;
  isStarted: boolean;
  startTime: Date | null;
  totalErrors: number;
  totalCorrectChars: number;
}

interface AccuracyResult {
  correctChars: number;
  errorCount: number;
}

export default function TypingBox(): JSX.Element {
  const [currentText, setCurrentText] = useState<TypingText | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [typingState, setTypingState] = useState<TypingState>({
    currentLineIndex: 0,
    userInput: "",
    isStarted: false,
    startTime: null,
    totalErrors: 0,
    totalCorrectChars: 0,
  });
  const [stats, setStats] = useState<Stats>({
    wpm: 0,
    accuracy: 100,
    timeElapsed: 0,
    errors: 0,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<number | null>(null);

  // 샘플 텍스트 메모이제이션
  const sampleTexts = useMemo(
    (): TypingText[] => [
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
    ],
    []
  );

  // 텍스트 처리 함수들 메모이제이션
  const lines = useMemo(
    (): string[] => currentText?.content.split("\n") || [],
    [currentText]
  );

  const currentLine = useMemo(
    (): string => lines[typingState.currentLineIndex] || "",
    [lines, typingState.currentLineIndex]
  );

  const upcomingLines = useMemo(
    (): string[] =>
      lines.slice(
        typingState.currentLineIndex + 1,
        typingState.currentLineIndex + 4
      ),
    [lines, typingState.currentLineIndex]
  );

  // 백엔드 연결 및 텍스트 가져오기
  const fetchRandomText = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch("http://localhost:3000/typing/texts/random");
      if (response.ok) {
        const data: TypingText = await response.json();
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
  }, [sampleTexts]);

  // 정확도 계산 최적화
  const calculateAccuracy = useCallback(
    (targetLine: string, input: string): AccuracyResult => {
      let correctChars = 0;
      let errorCount = 0;
      const minLength = Math.min(input.length, targetLine.length);

      for (let i = 0; i < minLength; i++) {
        if (input[i] === targetLine[i]) {
          correctChars++;
        } else {
          errorCount++;
        }
      }

      return { correctChars, errorCount };
    },
    []
  );

  // 총 타이핑 글자 수 계산 최적화
  const getTotalTypedChars = useCallback((): number => {
    let total = 0;
    for (let i = 0; i < typingState.currentLineIndex; i++) {
      total += lines[i]?.length || 0;
    }
    return total;
  }, [lines, typingState.currentLineIndex]);

  // 통계 계산 함수 분리
  const calculateStats = useCallback(
    (timeElapsed: number, currentAccuracy: AccuracyResult): Stats => {
      const totalCorrectNow =
        typingState.totalCorrectChars + currentAccuracy.correctChars;
      const totalTypedChars =
        getTotalTypedChars() + typingState.userInput.length;

      const minutes = Math.max(timeElapsed / 60, 1 / 60);
      const wpm = Math.round(totalCorrectNow / 5 / minutes);
      const accuracy =
        totalTypedChars > 0
          ? Math.round((totalCorrectNow / totalTypedChars) * 100)
          : 100;

      return {
        wpm,
        accuracy,
        timeElapsed,
        errors: typingState.totalErrors + currentAccuracy.errorCount,
      };
    },
    [
      typingState.totalCorrectChars,
      typingState.totalErrors,
      typingState.userInput.length,
      getTotalTypedChars,
    ]
  );

  // 실시간 통계 업데이트 최적화
  useEffect(() => {
    if (!typingState.isStarted || !typingState.startTime) return;

    intervalRef.current = window.setInterval(() => {
      const timeElapsed = Math.floor(
        (Date.now() - typingState.startTime!.getTime()) / 1000
      );
      const currentAccuracy = calculateAccuracy(
        currentLine,
        typingState.userInput
      );
      const newStats = calculateStats(timeElapsed, currentAccuracy);

      setStats(newStats);
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    typingState.isStarted,
    typingState.startTime,
    typingState.userInput,
    currentLine,
    calculateAccuracy,
    calculateStats,
  ]);

  // 줄 완료 처리
  const handleLineComplete = useCallback(
    (accuracy: AccuracyResult): void => {
      setTypingState((prev) => ({
        ...prev,
        totalCorrectChars: prev.totalCorrectChars + accuracy.correctChars,
        totalErrors: prev.totalErrors + accuracy.errorCount,
      }));

      if (typingState.currentLineIndex < lines.length - 1) {
        setTimeout(() => {
          setTypingState((prev) => ({
            ...prev,
            currentLineIndex: prev.currentLineIndex + 1,
            userInput: "",
          }));
          inputRef.current?.focus();
        }, 100);
      } else {
        completeTyping();
      }
    },
    [typingState.currentLineIndex, lines.length]
  );

  // 입력 처리 최적화
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const value = e.target.value;

      // 시작 처리
      if (!typingState.isStarted) {
        setTypingState((prev) => ({
          ...prev,
          isStarted: true,
          startTime: new Date(),
          userInput: value,
        }));
        return;
      }

      setTypingState((prev) => ({ ...prev, userInput: value }));

      // 줄 완료 체크
      if (value.length === currentLine.length) {
        const accuracy = calculateAccuracy(currentLine, value);
        handleLineComplete(accuracy);
      }
    },
    [typingState.isStarted, currentLine, calculateAccuracy, handleLineComplete]
  );

  // 타이핑 완료
  const completeTyping = useCallback(async (): Promise<void> => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 결과 저장 시도
    if (isConnected && currentText) {
      try {
        await fetch("http://localhost:3000/typing/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            textId: currentText.id,
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            totalTime: stats.timeElapsed,
            totalCharacters: currentText.content.length,
            correctCharacters: typingState.totalCorrectChars,
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
  }, [isConnected, currentText, stats, typingState.totalCorrectChars]);

  // 다시 시작 최적화
  const restart = useCallback((): void => {
    setTypingState({
      currentLineIndex: 0,
      userInput: "",
      isStarted: false,
      startTime: null,
      totalErrors: 0,
      totalCorrectChars: 0,
    });
    setStats({ wpm: 0, accuracy: 100, timeElapsed: 0, errors: 0 });

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    fetchRandomText();
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [fetchRandomText]);

  // 현재 줄 렌더링 (기존 디자인 유지)
  const renderCurrentLine = useMemo((): JSX.Element[] | null => {
    if (!currentLine) return null;

    return currentLine.split("").map((char, index) => {
      let color = "#333";
      let backgroundColor = "transparent";

      if (index < typingState.userInput.length) {
        if (typingState.userInput[index] === char) {
          color = "#28a745"; // 맞음
        } else {
          color = "#dc3545"; // 틀림
          backgroundColor = "#ffe6e6";
        }
      } else if (index === typingState.userInput.length) {
        backgroundColor = "#e3f2fd"; // 커서 위치
      }

      return (
        <span key={index} style={{ color, backgroundColor, padding: "1px" }}>
          {char}
        </span>
      );
    });
  }, [currentLine, typingState.userInput]);

  // 컴포넌트 마운트 시 텍스트 가져오기
  useEffect(() => {
    fetchRandomText();
  }, [fetchRandomText]);

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
        {currentText.title} ({typingState.currentLineIndex + 1}/{lines.length}
        줄)
      </div>

      {/* 현재 타이핑 영역 */}
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
          {renderCurrentLine}
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
        />
        <input
          ref={inputRef}
          type="text"
          value={typingState.userInput}
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

      {/* 미리보기 */}
      <div
        style={{
          width: "1030px",
          minHeight: "120px",
          backgroundColor: "#FFFFFF",
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <div style={{ fontSize: "16px", color: "#666", marginBottom: "10px" }}>
          다음 내용:
        </div>
        {upcomingLines.map((line, index) => (
          <p
            key={`preview-${typingState.currentLineIndex + 1 + index}`}
            style={{
              fontSize: "18px",
              marginLeft: "10px",
              marginBottom: "5px",
              fontFamily: "monospace",
              color: "#888",
            }}
          >
            {line || "\u00A0"}
          </p>
        ))}
      </div>

      {/* 제어 버튼 */}
      <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
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
