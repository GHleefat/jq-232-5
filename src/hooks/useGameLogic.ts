import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Direction, CustomGridConfig } from '../types/game';
import {
  createInitialState,
  canMoveTo,
  getDirectionDelta,
  calculateScore,
  formatTime,
} from '../utils/gameUtils';
import type { ScoreResult } from '../types/game';

export function useGameLogic(customConfig?: CustomGridConfig) {
  const [gameState, setGameState] = useState<GameState>(() => createInitialState(customConfig));
  const timerRef = useRef<number | null>(null);
  const customConfigRef = useRef(customConfig);

  useEffect(() => {
    customConfigRef.current = customConfig;
  }, [customConfig]);

  useEffect(() => {
    if (!gameState.completed) {
      timerRef.current = window.setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          elapsedTime: Date.now() - prev.startTime,
        }));
      }, 100);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.completed]);

  const moveMower = useCallback((direction: Direction) => {
    setGameState((prev) => {
      if (prev.completed) return prev;

      const { dx, dy } = getDirectionDelta(direction);
      const newX = prev.mower.x + dx;
      const newY = prev.mower.y + dy;

      if (!canMoveTo(prev.grid, newX, newY)) {
        return {
          ...prev,
          mower: { ...prev.mower, direction },
        };
      }

      const newGrid = prev.grid.map((row) => row.map((cell) => ({ ...cell })));
      let newMowedCells = prev.mowedCells;

      const targetCell = newGrid[newY][newX];
      if (targetCell.type === 'grass') {
        newGrid[newY][newX] = {
          ...targetCell,
          type: 'mowed',
          grassHeight: 0,
          mowedRow: newY,
          mowedCol: newX,
        };
        newMowedCells++;
      }

      const newPath = [...prev.path, { x: newX, y: newY, direction }];
      const isCompleted = prev.totalGrassCells > 0 && newMowedCells >= prev.totalGrassCells;

      return {
        ...prev,
        grid: newGrid,
        mower: { x: newX, y: newY, direction },
        mowedCells: newMowedCells,
        path: newPath,
        completed: isCompleted,
        elapsedTime: isCompleted ? Date.now() - prev.startTime : prev.elapsedTime,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setGameState(createInitialState(customConfigRef.current));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          moveMower('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          moveMower('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          moveMower('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          moveMower('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveMower]);

  const score: ScoreResult | null = gameState.completed ? calculateScore(gameState) : null;

  return {
    gameState,
    score,
    moveMower,
    resetGame,
    formattedTime: formatTime(gameState.elapsedTime),
    completionPercent: Math.round(
      gameState.totalGrassCells > 0 ? (gameState.mowedCells / gameState.totalGrassCells) * 100 : 0
    ),
  };
}
