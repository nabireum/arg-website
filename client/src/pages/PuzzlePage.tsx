/**
 * PUZZLE PAGE - Página de Enigma com Sliding Puzzle
 * 
 * Exibe um sliding puzzle que o jogador deve completar.
 * Após completar o puzzle, o jogador precisa digitar a resposta
 * que está visível na imagem montada.
 * 
 * Este é um tipo especial de enigma que combina:
 * 1. Desafio mecânico (montar o puzzle)
 * 2. Desafio lógico (extrair a resposta da imagem)
 */

import { useGame } from '@/contexts/GameContext';
import { useLocation, useRoute } from 'wouter';
import { useEffect, useState } from 'react';
import { obterEnigma, validarResposta, ENIGMAS_LISTA } from '@/data/enigmas';
import SlidingPuzzle from '@/components/SlidingPuzzle';

export default function PuzzlePage() {
  // ==================== HOOKS DE ROTEAMENTO ====================
  const [match, params] = useRoute('/:slug');
  const [, navigate] = useLocation();

  // ==================== HOOKS DO CONTEXTO DO JOGO ====================
  const { mode, timeRemaining, isTimeUp, completedPuzzles, markPuzzleComplete, endGame } = useGame();

  // ==================== ESTADO LOCAL ====================
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);

  // ==================== EXTRAÇÃO DE DADOS ====================
  const slug = params?.slug;
  const currentPuzzle = slug ? obterEnigma(slug) : null;

  // ==================== EFEITO: Validar se o jogo começou ====================
  useEffect(() => {
    if (!mode) {
      navigate('/');
    }
  }, [mode, navigate]);

  // ==================== EFEITO: Validar se o tempo acabou ====================
  useEffect(() => {
    if (isTimeUp && mode === 'hard') {
      endGame();
      navigate('/');
    }
  }, [isTimeUp, mode, endGame, navigate]);

  // ==================== EFEITO: Validar se o enigma existe ====================
  useEffect(() => {
    if (match && !currentPuzzle) {
      navigate('/');
    }
  }, [match, currentPuzzle, navigate]);

  // ==================== HANDLER: Puzzle completado ====================
  const handlePuzzleComplete = () => {
    setPuzzleComplete(true);
  };

  // ==================== HANDLER: Submeter resposta ====================
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
          setPuzzleComplete(false);
          navigate(`/${proximoEnigma}`);
        } else {
          endGame();
          navigate('/');
        }
      }, 1000);
    }
  };

  // ==================== FUNÇÃO AUXILIAR: Formatar tempo ====================
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==================== VALIDAÇÃO ====================
  if (!match || !currentPuzzle) {
    return null;
  }

  // ==================== RENDERIZAÇÃO ====================
  return (
    <div className="min-h-screen bg-black text-white flex flex-col px-4 py-8">
      {/* Background effect - horizontal scan lines */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px)',
          animation: 'scan 8s linear infinite'
        }} />
      </div>

      {/* ==================== ESTILOS ====================  */}
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

      {/* ==================== TIMER (Modo Difícil) ====================  */}
      {mode === 'hard' && (
        <div className={`fixed top-4 right-4 text-2xl font-bold tracking-widest z-50 ${isTimeUp ? 'pulse-warning' : ''}`} style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: timeRemaining < 60 ? '#ff0000' : '#ffffff',
          textShadow: timeRemaining < 60 ? '0 0 10px rgba(255,0,0,0.5)' : 'none'
        }}>
          {formatTime(timeRemaining)}
        </div>
      )}

      {/* ==================== CONTEÚDO PRINCIPAL ====================  */}
      <div className="relative z-10 max-w-2xl w-full mx-auto flex-1 flex flex-col justify-center">
        
        {/* ==================== INDICADOR DE PROGRESSO ====================  */}
        <div className="mb-12 text-center">
          <p className="text-xs tracking-widest mb-4" style={{
            fontFamily: "'Space Mono', monospace",
            color: 'rgba(255,255,255,0.6)'
          }}>
            ENIGMA: {slug?.toUpperCase()}
          </p>

          <div className="h-1 bg-gray-800 mb-8">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{
                width: `${((completedPuzzles.size + 1) / ENIGMAS_LISTA.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* ==================== TÍTULO ====================  */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center" style={{
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: '-0.02em',
          textShadow: '2px 2px 0px rgba(255,255,255,0.1)'
        }}>
          {currentPuzzle.title}
        </h1>

        {/* ==================== DIVISOR ====================  */}
        <div className="h-px bg-white my-8 mx-auto w-32" />

        {/* ==================== DESCRIÇÃO ====================  */}
        <p className="text-base md:text-lg text-center mb-12" style={{
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.05em',
          lineHeight: '1.8',
          whiteSpace: 'pre-wrap'
        }}>
          {currentPuzzle.question}
        </p>

        {/* ==================== SLIDING PUZZLE - SEMPRE VISÍVEL ====================  */}
        <div className="mb-12 flex justify-center">
          <SlidingPuzzle 
            imageUrl="/puzzle-festa.png"
            gridSize={5}
            onComplete={handlePuzzleComplete}
          />
        </div>

        {/* ==================== MENSAGEM APÓS COMPLETAR PUZZLE ====================  */}
        {puzzleComplete && (
          <div className="mb-8 p-4 border border-green-500 bg-gray-900 text-center" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: '#22c55e'
          }}>
            <p>✓ PUZZLE MONTADO!</p>
            <p className="text-sm mt-2" style={{ color: 'rgba(34,197,94,0.7)' }}>
              Agora, digite a resposta que você vê na imagem abaixo:
            </p>
          </div>
        )}

        {/* ==================== FORMULÁRIO DE RESPOSTA ====================  */}
        {puzzleComplete && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
            <label className="text-sm" style={{
              fontFamily: "'Space Mono', monospace",
              letterSpacing: '0.05em',
              color: 'rgba(255,255,255,0.7)'
            }}>
              INSIRA A RESPOSTA
            </label>

            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Sua resposta aqui..."
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
        )}

        {/* ==================== BOTÃO DE DICA ====================  */}
        {puzzleComplete && (
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
        )}

        {/* ==================== EXIBIÇÃO DE DICA ====================  */}
        {showHint && puzzleComplete && (
          <div className="mt-8 p-4 border border-white bg-gray-900" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.8)'
          }}>
            <p className="text-sm">DICA: {currentPuzzle.hint}</p>
          </div>
        )}

        {/* ==================== CONTADOR ====================  */}
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
