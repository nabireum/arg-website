import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type GameMode = 'normal' | 'hard' | null;

interface GameContextType {
  mode: GameMode;
  startGame: (mode: GameMode) => void;
  endGame: () => void;
  timeRemaining: number;
  isTimeUp: boolean;
  currentPuzzleIndex: number;
  setCurrentPuzzleIndex: (index: number) => void;
  completedPuzzles: Set<number>;
  markPuzzleComplete: (index: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const HARD_MODE_TIME = 15 * 60; // 15 minutes in seconds

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<GameMode>(null);
  const [timeRemaining, setTimeRemaining] = useState(HARD_MODE_TIME);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<number>>(new Set());

  // Timer effect - only runs in hard mode
  useEffect(() => {
    if (mode !== 'hard' || isTimeUp) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, isTimeUp]);

  const startGame = useCallback((selectedMode: GameMode) => {
    setMode(selectedMode);
    setTimeRemaining(HARD_MODE_TIME);
    setIsTimeUp(false);
    setCurrentPuzzleIndex(0);
    setCompletedPuzzles(new Set());
  }, []);

  const endGame = useCallback(() => {
    setMode(null);
    setTimeRemaining(HARD_MODE_TIME);
    setIsTimeUp(false);
    setCurrentPuzzleIndex(0);
    setCompletedPuzzles(new Set());
  }, []);

  const markPuzzleComplete = useCallback((index: number) => {
    setCompletedPuzzles((prev) => new Set([...Array.from(prev), index]));
  }, []);

  const value: GameContextType = {
    mode,
    startGame,
    endGame,
    timeRemaining,
    isTimeUp,
    currentPuzzleIndex,
    setCurrentPuzzleIndex,
    completedPuzzles: completedPuzzles,
    markPuzzleComplete,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
