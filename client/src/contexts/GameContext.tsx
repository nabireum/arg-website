import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type GameMode = 'normal' | 'hard' | null;

interface GameContextType {
  mode: GameMode;
  startGame: (mode: GameMode) => void;
  endGame: () => void;
  timeRemaining: number;
  isTimeUp: boolean;
  completedPuzzles: Set<string>;
  markPuzzleComplete: (slug: string) => void;
  puzzleStates: Map<string, boolean>;
  setPuzzleComplete: (slug: string, isComplete: boolean) => void;
}

const HARD_MODE_TIME = 15 * 60;

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<GameMode>(null);
  const [timeRemaining, setTimeRemaining] = useState(HARD_MODE_TIME);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<string>>(new Set());
  const [puzzleStates, setPuzzleStates] = useState<Map<string, boolean>>(new Map());

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
    setCompletedPuzzles(new Set());
    setPuzzleStates(new Map());
  }, []);

  const endGame = useCallback(() => {
    setMode(null);
    setTimeRemaining(HARD_MODE_TIME);
    setIsTimeUp(false);
    setCompletedPuzzles(new Set());
    setPuzzleStates(new Map());
  }, []);

  const markPuzzleComplete = useCallback((slug: string) => {
    setCompletedPuzzles((prev) => new Set([...Array.from(prev), slug]));
  }, []);

  const setPuzzleComplete = useCallback((slug: string, isComplete: boolean) => {
    setPuzzleStates((prev) => {
      const newMap = new Map(prev);
      newMap.set(slug, isComplete);
      return newMap;
    });
  }, []);

  const value: GameContextType = {
    mode,
    startGame,
    endGame,
    timeRemaining,
    isTimeUp,
    completedPuzzles,
    markPuzzleComplete,
    puzzleStates,
    setPuzzleComplete,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser usado dentro de GameProvider');
  }
  return context;
}
