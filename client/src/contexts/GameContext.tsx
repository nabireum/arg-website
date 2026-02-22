/**
 * GAME CONTEXT - Contexto Global do Jogo
 * 
 * Gerencia:
 * - Estado do jogo (normal ou hard)
 * - Timer de 15 minutos para modo hard
 * - Rastreamento de enigmas resolvidos
 * - Funções para iniciar/finalizar o jogo
 * 
 * Uso:
 * const { mode, timeRemaining, isTimeUp, completedPuzzles } = useGame();
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ==================== TIPOS ====================
export type GameMode = 'normal' | 'hard' | null;

interface GameContextType {
  mode: GameMode;
  startGame: (mode: GameMode) => void;
  endGame: () => void;
  timeRemaining: number;
  isTimeUp: boolean;
  completedPuzzles: Set<string>;
  markPuzzleComplete: (slug: string) => void;
}

// ==================== CONSTANTES ====================
// Timer de 15 minutos em segundos (15 * 60 = 900)
const HARD_MODE_TIME = 15 * 60;

// ==================== CRIAÇÃO DO CONTEXTO ====================
const GameContext = createContext<GameContextType | undefined>(undefined);

// ==================== PROVIDER COMPONENT ====================
/**
 * GameProvider - Componente que fornece o contexto do jogo
 * 
 * Deve envolver toda a aplicação (veja App.tsx)
 * 
 * Exemplo:
 * <GameProvider>
 *   <App />
 * </GameProvider>
 */
export function GameProvider({ children }: { children: React.ReactNode }) {
  // ==================== ESTADO ====================
  // mode: qual modo o jogador escolheu ('normal', 'hard', ou null se não começou)
  const [mode, setMode] = useState<GameMode>(null);
  
  // timeRemaining: tempo restante em segundos (começa em 900 para modo hard)
  const [timeRemaining, setTimeRemaining] = useState(HARD_MODE_TIME);
  
  // isTimeUp: true quando o tempo acabou (só em modo hard)
  const [isTimeUp, setIsTimeUp] = useState(false);
  
  // completedPuzzles: Set com os slugs dos enigmas já resolvidos
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<string>>(new Set());

  // ==================== EFEITO: TIMER ====================
  /**
   * Efeito que decrementa o timer a cada segundo
   * Só roda em modo HARD e enquanto o tempo não acabou
   * 
   * Quando timeRemaining chega a 0, seta isTimeUp = true
   */
  useEffect(() => {
    // Condições para não rodar o timer
    if (mode !== 'hard' || isTimeUp) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Tempo acabou!
          setIsTimeUp(true);
          return 0;
        }
        // Decrementa 1 segundo
        return prev - 1;
      });
    }, 1000); // Executa a cada 1000ms (1 segundo)

    // Cleanup: para o intervalo quando o componente desmontar
    return () => clearInterval(interval);
  }, [mode, isTimeUp]);

  // ==================== FUNÇÕES ====================

  /**
   * startGame - Inicia um novo jogo
   * 
   * Reseta todos os estados para começar do zero
   * 
   * @param selectedMode - 'normal' ou 'hard'
   */
  const startGame = useCallback((selectedMode: GameMode) => {
    setMode(selectedMode);
    setTimeRemaining(HARD_MODE_TIME);
    setIsTimeUp(false);
    setCompletedPuzzles(new Set());
  }, []);

  /**
   * endGame - Finaliza o jogo
   * 
   * Reseta todos os estados (volta ao inicial)
   * Chamado quando:
   * - Jogador completa todos os enigmas
   * - Tempo acabar em modo hard
   * - Jogador clica em "voltar" na página inicial
   */
  const endGame = useCallback(() => {
    setMode(null);
    setTimeRemaining(HARD_MODE_TIME);
    setIsTimeUp(false);
    setCompletedPuzzles(new Set());
  }, []);

  /**
   * markPuzzleComplete - Marca um enigma como completo
   * 
   * Adiciona o slug do enigma ao Set de completedPuzzles
   * Usado para rastrear progresso e exibir a barra de progresso
   * 
   * @param slug - O slug do enigma (ex: 'cofre')
   */
  const markPuzzleComplete = useCallback((slug: string) => {
    setCompletedPuzzles((prev) => new Set([...Array.from(prev), slug]));
  }, []);

  // ==================== VALOR DO CONTEXTO ====================
  const value: GameContextType = {
    mode,
    startGame,
    endGame,
    timeRemaining,
    isTimeUp,
    completedPuzzles,
    markPuzzleComplete,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// ==================== HOOK CUSTOMIZADO ====================
/**
 * useGame - Hook para acessar o contexto do jogo
 * 
 * Deve ser usado dentro de um componente que está dentro de <GameProvider>
 * 
 * Exemplo:
 * function MeuComponente() {
 *   const { mode, timeRemaining } = useGame();
 *   return <div>{mode} - {timeRemaining}s</div>;
 * }
 * 
 * @throws Error se usado fora de GameProvider
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame deve ser usado dentro de GameProvider');
  }
  return context;
}
