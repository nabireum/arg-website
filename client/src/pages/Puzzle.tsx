import { useLocation, useRoute } from 'wouter';
import { useEffect, useState } from 'react';
import { obterEnigma, validarResposta, ENIGMAS_LISTA } from '@/data/enigmas';
import SlidingPuzzle from '@/components/SlidingPuzzle';
import { useGame } from '@/contexts/GameContext';


export default function Puzzle() {
  // ==================== HOOKS DE ROTEAMENTO ====================
  // match: true se a rota atual é um slug válido
  // params: contém o slug da URL (ex: { slug: 'cofre' })
  const [match, params] = useRoute('/:slug');
  const [, navigate] = useLocation();

  // ==================== HOOKS DO CONTEXTO DO JOGO ====================
  // mode: 'normal' ou 'hard' (null se não iniciou)
  // timeRemaining: tempo restante em segundos (só em modo hard)
  // isTimeUp: true se o tempo acabou
  // completedPuzzles: Set com os slugs dos enigmas resolvidos
  // markPuzzleComplete: função para marcar um enigma como completo
  // endGame: função para finalizar o jogo
  const { mode, timeRemaining, isTimeUp, completedPuzzles, markPuzzleComplete, endGame } = useGame();

  // ==================== ESTADO LOCAL ====================
  // userAnswer: o que o jogador digitou no campo de senha
  const [userAnswer, setUserAnswer] = useState('');
  // showHint: se a dica está visível ou não
  const [showHint, setShowHint] = useState(false);
  // isCorrect: true se a resposta foi aceita (para desabilitar inputs)
  const [isCorrect, setIsCorrect] = useState(false);

  // ==================== EXTRAÇÃO DE DADOS ====================
  // slug: o identificador do enigma na URL
  const slug = params?.slug;
  // currentPuzzle: o objeto do enigma atual (ou undefined se não existir)
  const currentPuzzle = slug ? obterEnigma(slug) : null;

  // ==================== EFEITO: Validar se o jogo começou ====================
  // Se não estiver em um modo de jogo, redireciona para home
  useEffect(() => {
    if (!mode) {
      navigate('/');
    }
  }, [mode, navigate]);

  // ==================== EFEITO: Validar se o tempo acabou ====================
  // Em modo HARD, se o tempo acabar, finaliza o jogo e volta para home
  useEffect(() => {
    if (isTimeUp && mode === 'hard') {
      endGame();
      navigate('/');
    }
  }, [isTimeUp, mode, endGame, navigate]);

  // ==================== EFEITO: Validar se o enigma existe ====================
  // Se a rota é válida mas o enigma não existe, redireciona para home
  useEffect(() => {
    if (match && !currentPuzzle) {
      navigate('/');
    }
  }, [match, currentPuzzle, navigate]);

  // ==================== HANDLER: Submeter resposta ====================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Valida a resposta usando a função do arquivo enigmas.ts
    if (validarResposta(slug!, userAnswer)) {
      // ✓ Resposta correta!
      setIsCorrect(true);
      // Marca este enigma como completo
      markPuzzleComplete(slug!);

      // Aguarda 1 segundo e depois navega para o próximo
      setTimeout(() => {
        // Obtém o próximo enigma
        const proximoEnigma = currentPuzzle!.nextSlug;

        if (proximoEnigma) {
          // Se houver próximo, vai para lá
          setUserAnswer('');
          setShowHint(false);
          setIsCorrect(false);
          navigate(`/${proximoEnigma}`);
        } else {
          // Se não houver próximo, completou todos os enigmas!
          endGame();
          navigate('/');
        }
      }, 1000);
    }
    // Se a resposta estiver errada, o campo fica vermelho (CSS) mas não faz nada
  };

  // ==================== FUNÇÃO AUXILIAR: Formatar tempo ====================
  // Converte segundos em formato MM:SS (ex: 14:32)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ==================== VALIDAÇÃO: Se não há match ou enigma, não renderiza ====================
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

      {/* ==================== ESTILOS GLOBAIS ==================== */}
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

      {/* ==================== TIMER (Modo Difícil) ==================== */}
      {/* Só aparece em modo HARD, fica vermelho quando faltam menos de 60 segundos */}
      {mode === 'hard' && (
        <div className={`fixed top-4 right-4 text-2xl font-bold tracking-widest z-50 ${isTimeUp ? 'pulse-warning' : ''}`} style={{
          fontFamily: "'IBM Plex Mono', monospace",
          color: timeRemaining < 60 ? '#ff0000' : '#ffffff',
          textShadow: timeRemaining < 60 ? '0 0 10px rgba(255,0,0,0.5)' : 'none'
        }}>
          {formatTime(timeRemaining)}
        </div>
      )}

      {/* ==================== CONTEÚDO PRINCIPAL ==================== */}
      <div className="relative z-10 max-w-2xl w-full mx-auto flex-1 flex flex-col justify-center">
        
        {/* ==================== INDICADOR DE PROGRESSO ==================== */}
        <div className="mb-12 text-center">
          {/* Slug do enigma atual */}
          <p className="text-xs tracking-widest mb-4" style={{
            fontFamily: "'Space Mono', monospace",
            color: 'rgba(255,255,255,0.6)'
          }}>
            ENIGMA: {slug?.toUpperCase()}
          </p>

          {/* Barra de progresso visual */}
          <div className="h-1 bg-gray-800 mb-8">
            <div 
              className="h-full bg-white transition-all duration-300"
              style={{
                // Calcula a porcentagem de enigmas resolvidos
                width: `${((completedPuzzles.size + 1) / ENIGMAS_LISTA.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* ==================== TÍTULO DO ENIGMA ==================== */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center" style={{
          fontFamily: "'IBM Plex Mono', monospace",
          letterSpacing: '-0.02em',
          textShadow: '2px 2px 0px rgba(255,255,255,0.1)'
        }}>
          {currentPuzzle.title}
        </h1>

        {/* ==================== DIVISOR VISUAL ==================== */}
        <div className="h-px bg-white my-8 mx-auto w-32" />

        {/* ==================== TEXTO DO ENIGMA ==================== */}
        <p className="text-base md:text-lg text-center mb-12" style={{
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.05em',
          lineHeight: '1.8',
          whiteSpace: 'pre-wrap'
        }}>
          {currentPuzzle.question}
        </p>

        {/* ==================== SLIDING PUZZLE MINIGAME (para enigma 'festa') ==================== */}
        {slug === 'festa' && (
          <div className="mb-12 flex justify-center">
            <SlidingPuzzle 
              imageUrl="/puzzle-festa.png"
              gridSize={3}
            />
          </div>
        )}

        {/* ==================== FORMULÁRIO DE RESPOSTA ==================== */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          {/* Label */}
          <label className="text-sm" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.7)'
          }}>
            INSIRA A SENHA
          </label>

          {/* Input de senha */}
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

          {/* Botão de envio */}
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

        {/* ==================== BOTÃO DE DICA ==================== */}
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

        {/* ==================== EXIBIÇÃO DE DICA ==================== */}
        {showHint && (
          <div className="mt-8 p-4 border border-white bg-gray-900" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.8)'
          }}>
            <p className="text-sm">DICA: {currentPuzzle.hint}</p>
          </div>
        )}

        {/* ==================== CONTADOR DE ENIGMAS RESOLVIDOS ==================== */}
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
