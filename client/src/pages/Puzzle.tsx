import { useLocation, useRoute } from 'wouter';
import { useEffect, useState } from 'react';
import { obterEnigma, validarResposta, ENIGMAS_LISTA } from '@/data/enigmas';
import SlidingPuzzle from '@/components/SlidingPuzzle';
import { useGame } from '@/contexts/GameContext';

export default function Puzzle() {
  const [match, params] = useRoute('/:slug');
  const [, navigate] = useLocation();
  const { mode, timeRemaining, isTimeUp, completedPuzzles, markPuzzleComplete, endGame } = useGame();

  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const slug = params?.slug;
  const currentPuzzle = slug ? obterEnigma(slug) : null;

  useEffect(() => {
    if (!mode) navigate('/');
  }, [mode, navigate]);

  useEffect(() => {
    if (isTimeUp && mode === 'hard') {
      endGame();
      navigate('/');
    }
  }, [isTimeUp, mode, endGame, navigate]);

  useEffect(() => {
    if (match && !currentPuzzle) navigate('/');
  }, [match, currentPuzzle, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validarResposta(slug!, userAnswer)) {
      setIsCorrect(true);
      markPuzzleComplete(slug!);
      setTimeout(() => {
        const proximoEnigma = currentPuzzle!.nextSlug;
        if (proximoEnigma) {
          setUserAnswer('');
          setShowHint(false);
          setIsCorrect(false);
          navigate(`/${proximoEnigma}`);
        } else {
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

  if (!currentPuzzle) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="relative z-10 max-w-2xl w-full">
        {/* Header */}
        <div className="mb-12">
          {mode === 'hard' && (
            <div className="text-center mb-4">
              <span className="text-2xl font-bold" style={{
                fontFamily: "'IBM Plex Mono', monospace",
                color: timeRemaining < 60 ? '#ef4444' : 'white'
              }}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
          <p className="text-xs tracking-widest mb-4" style={{
            fontFamily: "'Space Mono', monospace",
            color: 'rgba(255,255,255,0.6)'
          }}>
            ENIGMA: {slug?.toUpperCase()}
          </p>
          <div className="h-1 bg-gray-800 mb-8">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${((completedPuzzles.size + 1) / ENIGMAS_LISTA.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center" style={{
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: '-0.02em',
          textShadow: '2px 2px 0px rgba(255,255,255,0.1)'
        }}>
          {currentPuzzle.title}
        </h1>

        <div className="h-px bg-white my-8 mx-auto w-32" />

        {/* Question */}
        <p className="text-base md:text-lg text-center mb-12" style={{
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.05em',
          lineHeight: '1.8',
          whiteSpace: 'pre-wrap'
        }}>
          {currentPuzzle.question}
        </p>

        {/* Sliding Puzzle (enigma 'festa') */}
        {slug === 'festa' && (
          <div className="mb-12 flex justify-center">
            <SlidingPuzzle imageUrl="/puzzle-festa.png" gridSize={3} />
          </div>
        )}

        {/* Answer form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <label className="text-sm" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.7)'
          }}>
            INSIRA A SENHA
          </label>
          <input
            type="password"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="••••••••••••••••"
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
            {isCorrect ? '✓ CORRETO' : 'ENVIAR'}
          </button>
        </form>

        {/* Hint */}
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
            {showHint ? 'OCULTAR DICA' : 'MOSTRAR DICA'}
          </button>
        </div>

        {showHint && (
          <div className="mt-8 p-4 border border-white bg-gray-900" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.8)'
          }}>
            <p className="text-sm">DICA: {currentPuzzle.hint}</p>
          </div>
        )}

        {completedPuzzles.size > 0 && (
          <div className="mt-12 text-center text-xs" style={{
            fontFamily: "'Space Mono', monospace",
            color: 'rgba(255,255,255,0.4)'
          }}>
            <p>ENIGMAS RESOLVIDOS: {completedPuzzles.size} / {ENIGMAS_LISTA.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}
