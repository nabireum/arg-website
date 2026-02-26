import { useLocation, useRoute } from 'wouter';
import { useEffect, useState } from 'react';
import { obterEnigma, validarResposta, ENIGMAS_LISTA } from '@/data/enigmas';
import SlidingPuzzle from '@/components/SlidingPuzzle';
import { useGame } from '@/contexts/GameContext';

export default function Puzzle() {
  const [match, params] = useRoute('/room1/:slug');
  const [, navigate] = useLocation();
  const { mode, timeRemaining, isTimeUp, completedPuzzles, markPuzzleComplete, endGame } = useGame();

  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const slug = params?.slug;
  const currentPuzzle = slug ? obterEnigma(slug) : null;

  useEffect(() => {
    if (!mode) navigate('/room1');
  }, [mode, navigate]);

  useEffect(() => {
    if (isTimeUp && mode === 'hard') {
      endGame();
      navigate('/room1');
    }
  }, [isTimeUp, mode, endGame, navigate]);

  useEffect(() => {
    if (match && !currentPuzzle) navigate('/room1');
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
          navigate(`/room1/${proximoEnigma}`);
        } else {
          endGame();
          navigate('/room1');
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
        {/* Header - Timer only */}
        {mode === 'hard' && (
          <div className="text-center mb-12">
            <span className="text-2xl font-bold" style={{
              fontFamily: "'IBM Plex Mono', monospace",
              color: timeRemaining < 60 ? '#ef4444' : 'white'
            }}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}

        {/* Progress bar */}
        <div className="h-1 bg-gray-800 mb-12">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${((completedPuzzles.size + 1) / ENIGMAS_LISTA.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        {slug === 'amongus' ? (
          <div className="text-center mb-12">
            <div className="flex justify-center gap-8 mb-8">
              <span style={{ fontSize: '120px' }}>🍍</span>
              <span style={{ fontSize: '80px', marginTop: '20px' }}>,</span>
              <span style={{ fontSize: '120px' }}>📚</span>
              <span style={{ fontSize: '80px', marginTop: '20px' }}>,</span>
              <span style={{ fontSize: '120px' }}>🎧</span>
            </div>
          </div>
        ) : slug === 'tucupi' ? (
          <div className="mb-12">
            <div className="h-px bg-white/70 mb-12 mx-auto w-32" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
              <ul className="list-disc pl-6 space-y-2" style={{
                fontFamily: "'Space Mono', monospace",
                letterSpacing: '0.05em',
                lineHeight: '1.6'
              }}>
                <li>???</li>
                <li>Purê de batata doce</li>
                <li>Vagem no vapor com Alho Assado</li>
              </ul>
              <ul className="list-disc pl-6 space-y-2" style={{
                fontFamily: "'Space Mono', monospace",
                letterSpacing: '0.05em',
                lineHeight: '1.6'
              }}>
                <li>???</li>
                <li>Arroz com Ervas Finas</li>
                <li>Abobrinha Grelhada</li>
              </ul>
              <ul className="list-disc pl-6 space-y-2" style={{
                fontFamily: "'Space Mono', monospace",
                letterSpacing: '0.05em',
                lineHeight: '1.6'
              }}>
                <li>???</li>
                <li>Gratin Dauphinois</li>
                <li>Vagem Francesa</li>
                <li>Purê de Batata</li>
                <li>Legumes Glaceados</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-base md:text-lg text-center mb-12" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap'
          }}>
            {currentPuzzle.question}
          </p>
        )}

        {/* Sliding Puzzle (enigma 'festa') */}
        {slug === 'festa' && (
          <div className="mb-12 flex justify-center">
            <SlidingPuzzle gridSize={3} />
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="••••••••••••••••"
              disabled={isCorrect}
              className="w-full px-4 py-4 pr-12 bg-gray-900 border-2 border-white text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors disabled:opacity-50"
              style={{
                fontFamily: "'Space Mono', monospace",
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isCorrect}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors disabled:opacity-50"
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M15.171 13.576l1.414 1.414A10.016 10.016 0 0120.458 10C19.184 5.943 15.394 3 11 3a9.948 9.948 0 00-4.843 1.269l1.415 1.415A7.971 7.971 0 0111 5a8 8 0 018 8c0 .718-.102 1.413-.29 2.061zm-2.828 2.828l1.415 1.415c-1.08.58-2.291.91-3.758.91a8 8 0 01-8-8c0-1.467.33-2.678.91-3.758l1.415 1.415A6.981 6.981 0 005 10a7 7 0 007 7c1.467 0 2.678-.33 3.757-.91z" />
                </svg>
              )}
            </button>
          </div>
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
