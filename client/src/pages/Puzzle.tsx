import { useGame } from '@/contexts/GameContext';
import { useLocation, useRoute } from 'wouter';
import { useEffect, useState } from 'react';

/**
 * Puzzle Page - ARG Cyberpunk Dystopian Style
 * 
 * Design Philosophy: Minimalismo Cibernético Distópico
 * - Exibe um enigma por vez
 * - Timer visível no topo em modo HARD
 * - Sistema de navegação entre enigmas
 */

// Exemplo de enigmas - você pode expandir isso
const PUZZLES = [
  {
    id: 0,
    title: 'PUZZLE 01',
    question: 'WHAT LIES BENEATH THE SURFACE?',
    hint: 'LOOK FOR HIDDEN TEXT IN THE PAGE SOURCE',
    answer: 'truth',
  },
  {
    id: 1,
    title: 'PUZZLE 02',
    question: 'THE ANSWER IS ALWAYS HIDDEN IN PLAIN SIGHT',
    hint: 'THINK ABOUT WHAT YOU SEE',
    answer: 'see',
  },
  {
    id: 2,
    title: 'PUZZLE 03',
    question: 'FINAL TEST: WHAT HAVE YOU LEARNED?',
    hint: 'REMEMBER THE BEGINNING',
    answer: 'believe',
  },
];

export default function Puzzle() {
  const [match, params] = useRoute('/puzzle/:id');
  const [, navigate] = useLocation();
  const { mode, timeRemaining, isTimeUp, currentPuzzleIndex, setCurrentPuzzleIndex, markPuzzleComplete, completedPuzzles, endGame } = useGame();
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const puzzleId = parseInt(params?.id || '0');
  const currentPuzzle = PUZZLES[puzzleId];

  // Redireciona para home se não estiver em um modo de jogo
  useEffect(() => {
    if (!mode) {
      navigate('/');
    }
  }, [mode, navigate]);

  // Redireciona para home se o tempo acabar em modo HARD
  useEffect(() => {
    if (isTimeUp && mode === 'hard') {
      endGame();
      navigate('/');
    }
  }, [isTimeUp, mode, endGame, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.toLowerCase().trim() === currentPuzzle.answer.toLowerCase()) {
      setIsCorrect(true);
      markPuzzleComplete(puzzleId);
      
      // Se houver próximo enigma, vai para lá após 1 segundo
      setTimeout(() => {
        if (puzzleId < PUZZLES.length - 1) {
          setUserAnswer('');
          setShowHint(false);
          setIsCorrect(false);
          navigate(`/puzzle/${puzzleId + 1}`);
        } else {
          // Completou todos os enigmas
          endGame();
          navigate('/');
        }
      }, 1000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!match || !currentPuzzle) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-4 py-8">
      {/* Background effect - horizontal scan lines */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px)',
          animation: 'scan 8s linear infinite'
        }} />
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
        @keyframes pulse-warning {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .pulse-warning {
          animation: pulse-warning 1s infinite;
        }
      `}</style>

      {/* Timer - only visible in hard mode */}
      {mode === 'hard' && (
        <div className={`fixed top-4 right-4 text-2xl font-bold tracking-widest z-50 ${isTimeUp ? 'pulse-warning' : ''}`} style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: timeRemaining < 60 ? '#ff0000' : '#ffffff',
          textShadow: timeRemaining < 60 ? '0 0 10px rgba(255,0,0,0.5)' : 'none'
        }}>
          {formatTime(timeRemaining)}
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 max-w-2xl w-full mx-auto flex-1 flex flex-col justify-center">
        {/* Progress indicator */}
        <div className="mb-12 text-center">
          <p className="text-xs tracking-widest mb-4" style={{
            fontFamily: "'Space Mono', monospace",
            color: 'rgba(255,255,255,0.6)'
          }}>
            PUZZLE {puzzleId + 1} OF {PUZZLES.length}
          </p>
          
          {/* Progress bar */}
          <div className="h-1 bg-gray-800 mb-8">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{
                width: `${((puzzleId + 1) / PUZZLES.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Puzzle title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center" style={{
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: '-0.02em',
          textShadow: '2px 2px 0px rgba(255,255,255,0.1)'
        }}>
          {currentPuzzle.title}
        </h1>

        {/* Divider */}
        <div className="h-px bg-white my-8 mx-auto w-32" />

        {/* Puzzle question */}
        <p className="text-lg md:text-xl text-center mb-12" style={{
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.05em',
          lineHeight: '1.8'
        }}>
          {currentPuzzle.question}
        </p>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="ENTER YOUR ANSWER"
            disabled={isCorrect}
            className="px-4 py-4 bg-gray-900 border-2 border-white text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
            style={{
              fontFamily: "'Space Mono', monospace",
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          />
          
          <button
            type="submit"
            disabled={isCorrect}
            className="px-6 py-4 border-2 border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-100 active:scale-95 disabled:opacity-50"
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            {isCorrect ? '✓ CORRECT' : 'SUBMIT'}
          </button>
        </form>

        {/* Hint button */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-100 text-sm"
            style={{
              fontFamily: "'Space Mono', monospace",
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}
          >
            {showHint ? 'HIDE HINT' : 'SHOW HINT'}
          </button>
        </div>

        {/* Hint display */}
        {showHint && (
          <div className="mt-8 p-4 border border-white bg-gray-900" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.8)'
          }}>
            <p className="text-sm">HINT: {currentPuzzle.hint}</p>
          </div>
        )}

        {/* Completed puzzles indicator */}
        {completedPuzzles.size > 0 && (
          <div className="mt-12 text-center text-xs" style={{
            fontFamily: "'Space Mono', monospace",
            color: 'rgba(255,255,255,0.4)'
          }}>
            <p>PUZZLES SOLVED: {completedPuzzles.size} / {PUZZLES.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}
