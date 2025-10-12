"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

const CELL_SIZE = 25;
const INITIAL_SNAKE_LENGTH = 5;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Point = { x: number; y: number };
//
type Props = {
  onGameOver: () => void;
  showTouchControls?: boolean;
};

export default function Game({ onGameOver, showTouchControls = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gridCols, setGridCols] = useState(0);
  const [gridRows, setGridRows] = useState(0);
  const [snake, setSnake] = useState<Point[]>([]);
  const [food, setFood] = useState<Point>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const updateGrid = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setGridCols(Math.floor(clientWidth / CELL_SIZE));
        setGridRows(Math.floor(clientHeight / CELL_SIZE));
      }
    };

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateGrid, 150);
    };

    updateGrid();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const generateFood = (snakePositions: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridCols),
        y: Math.floor(Math.random() * gridRows),
      };
    } while (
      snakePositions.some((seg) => seg.x === newFood.x && seg.y === newFood.y)
    );
    return newFood;
  };

  const initGame = () => {
    if (gridCols === 0 || gridRows === 0) return;

    const initialSnake: Point[] = [];
    const startY = Math.floor(gridRows / 2);
    for (let i = INITIAL_SNAKE_LENGTH - 1; i >= 0; i--) {
      initialSnake.push({ x: i, y: startY });
    }

    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection("RIGHT");
    setGameOver(false);
    containerRef.current?.focus();
  };

  useEffect(() => {
    initGame();
  }, [gridCols, gridRows]);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const newSnake = [...prev];
        const head = { ...newSnake[0] };

        switch (direction) {
          case "UP":
            head.y -= 1;
            break;
          case "DOWN":
            head.y += 1;
            break;
          case "LEFT":
            head.x -= 1;
            break;
          case "RIGHT":
            head.x += 1;
            break;
        }

        if (
          head.x < 0 ||
          head.x >= gridCols ||
          head.y < 0 ||
          head.y >= gridRows ||
          newSnake.some((seg) => seg.x === head.x && seg.y === head.y)
        ) {
          setGameOver(true);
          return prev;
        }

        newSnake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [direction, food, gameOver, gridCols, gridRows]);

  useEffect(() => {
    if (gameOver) {
      onGameOver();
    }
  }, [gameOver, onGameOver]);

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (gameOver) return;

    if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
    if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
    if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
    if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
  };

  const handleTouchControl = (newDir: Direction) => {
    if (gameOver) return;

    if (
      (newDir === "UP" && direction !== "DOWN") ||
      (newDir === "DOWN" && direction !== "UP") ||
      (newDir === "LEFT" && direction !== "RIGHT") ||
      (newDir === "RIGHT" && direction !== "LEFT")
    ) {
      setDirection(newDir);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyPress}
        className="outline-none"
        style={{
          width: "80vw",
          height: "40vh",
          maxWidth: "600px",
          maxHeight: "600px",
          margin: "auto",
          backgroundColor: "#000",
          display: "grid",
          gridTemplateColumns: `repeat(${gridCols}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${gridRows}, ${CELL_SIZE}px)`,
          userSelect: "none",
          border: "2px solid white",
          borderRadius: "10px",
          overflow: "hidden",
          boxSizing: "content-box",
          position: "relative",
        }}
        autoFocus
      >
        {Array.from({ length: gridCols * gridRows }).map((_, idx) => {
          const x = idx % gridCols;
          const y = Math.floor(idx / gridCols);

          const isSnake = snake.some((seg) => seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={idx}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                boxSizing: "border-box",
                border: "1px solid #1a1a1a",
                backgroundColor: isSnake ? "#ffffff" : isFood ? "#fff" : "#000",
                position: "relative",
              }}
            >
              {isFood && (
                <div
                  style={{
                    width: "60%",
                    height: "60%",
                    backgroundColor: "#fff",
                    border: "2px solid #000",
                    borderRadius: "50%",
                    margin: "auto",
                    marginTop: "20%",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* أزرار التحكم باللمس على شكل + مربعة */}
      {showTouchControls && (
        <div className="mt-6 flex justify-center items-center max-w-md mx-auto select-none">
          <div className="grid grid-cols-3 grid-rows-3 gap-2">
            {/* الصف العلوي */}
            <div></div>
            <button
              onClick={() => handleTouchControl("UP")}
              className="bg-white text-black text-xl w-14 h-14 rounded-md shadow hover:bg-gray-300 transition flex items-center justify-center"
              aria-label="Up"
            >
              ↑
            </button>
            <div></div>

            {/* الصف الأوسط */}
            <button
              onClick={() => handleTouchControl("LEFT")}
              className="bg-white text-black text-xl w-14 h-14 rounded-md shadow hover:bg-gray-300 transition flex items-center justify-center"
              aria-label="Left"
            >
              ←
            </button>
            <div className="w-14 h-14" />
            <button
              onClick={() => handleTouchControl("RIGHT")}
              className="bg-white text-black text-xl w-14 h-14 rounded-md shadow hover:bg-gray-300 transition flex items-center justify-center"
              aria-label="Right"
            >
              →
            </button>

            {/* الصف السفلي */}
            <div></div>
            <button
              onClick={() => handleTouchControl("DOWN")}
              className="bg-white text-black text-xl w-14 h-14 rounded-md shadow hover:bg-gray-300 transition flex items-center justify-center"
              aria-label="Down"
            >
              ↓
            </button>
            <div></div>
          </div>
        </div>
      )}
    </>
  );
}
