import { useGame } from '@/contexts/GameContext';
import { useLocation, useRoute } from 'wouter';
import { useEffect, useState } from 'react';

/**
 * Puzzle Page - ARG Cyberpunk Dystopian Style
 * 
 * Design Philosophy: Minimalismo Cibernético Distópico
 * - Exibe um enigma por vez
 * - Timer visível no topo em modo HARD
 * - Sistema de navegação entre enigmas com slugs personalizados
 * 
 * COMO ADICIONAR NOVOS ENIGMAS:
 * 1. Adicione um novo objeto ao array PUZZLES_BY_SLUG abaixo
 * 2. Use um slug único (ex: "cofre", "arquivo", "segredo")
 * 3. O slug será usado na URL: /segredobalian.com/[slug]
 * 4. Defina title, question, hint, answer e nextSlug (null se for o último)
 */

interface Puzzle {
  slug: string;
  title: string;
  question: string;
  hint: string;
  answer: string;
  nextSlug: string | null; // slug do próximo enigma, null se for o último
}

// Mapa de enigmas por slug
const PUZZLES_BY_SLUG: Record<string, Puzzle> = {
  cofre: {
    slug: 'cofre',
    title: 'COFRE',
    question: `Se está lendo isso, então provavelmente gostaria de saber a verdade. Mas preciso ter certeza de que a pessoa errada não chegou até aqui por engano. Se teve acesso àqueles documentos, então já sabe o que fazer. Prove que meu segredo está seguro contigo.`,
    hint: 'A resposta está nos documentos que você encontrou anteriormente',
    answer: '7Q!mZ9@F#2KxR$A8',
    nextSlug: null, // Será preenchido quando você adicionar o próximo enigma
  },
  // EXEMPLO DE COMO ADICIONAR NOVO ENIGMA:
  // arquivo: {
  //   slug: 'arquivo',
  //   title: 'ARQUIVO',
  //   question: 'Sua pergunta aqui',
  //   hint: 'Sua dica aqui',
  //   answer: 'resposta',
  //   nextSlug: null,
  // },
};

export default function Puzzle() {
  const [match, params] = useRoute('/:slug');
  const [, navigate] = useLocation();
  const { mode, timeRemaining, isTimeUp, completedPuzzles, markPuzzleComplete, endGame } = useGame();
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const slug = params?.slug;
  const currentPuzzle = slug ? PUZZLES_BY_SLUG[slug] : null;

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

  // Redireciona para home se o enigma não existir
  useEffect(() => {
    if (match && !currentPuzzle) {
      navigate('/');
    }
  }, [match, currentPuzzle, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userAnswer.toLowerCase().trim() === currentPuzzle!.answer.toLowerCase()) {
      setIsCorrect(true);
      markPuzzleComplete(slug!);
      
      // Se houver próximo enigma, vai para lá após 1 segundo
      setTimeout(() => {
        if (currentPuzzle!.nextSlug) {
          setUserAnswer('');
          setShowHint(false);
          setIsCorrect(false);
          navigate(`/${currentPuzzle!.nextSlug}`);
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
            ENIGMA: {slug?.toUpperCase()}
          </p>
          
          {/* Progress bar */}
          <div className="h-1 bg-gray-800 mb-8">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{
                width: `${((completedPuzzles.size + 1) / Object.keys(PUZZLES_BY_SLUG).length) * 100}%`
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
        <p className="text-base md:text-lg text-center mb-12" style={{
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.05em',
          lineHeight: '1.8',
          whiteSpace: 'pre-wrap'
        }}>
          {currentPuzzle.question}
        </p>

        {/* Input form */}
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
            {showHint ? 'OCULTAR DICA' : 'MOSTRAR DICA'}
          </button>
        </div>

        {/* Hint display */}
        {showHint && (
          <div className="mt-8 p-4 border border-white bg-gray-900" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.8)'
          }}>
            <p className="text-sm">DICA: {currentPuzzle.hint}</p>
          </div>
        )}

        {/* Completed puzzles indicator */}
        {completedPuzzles.size > 0 && (
          <div className="mt-12 text-center text-xs" style={{
            fontFamily: "'Space Mono', monospace",
            color: 'rgba(255,255,255,0.4)'
          }}>
            <p>ENIGMAS RESOLVIDOS: {completedPuzzles.size} / {Object.keys(PUZZLES_BY_SLUG).length}</p>
          </div>
        )}
      </div>
    </div>
  );
}
