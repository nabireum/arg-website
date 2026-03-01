import { useLocation, useRoute } from 'wouter';
import { useEffect, useMemo, useRef, useState } from 'react';
import { obterEnigma, validarResposta, ENIGMAS_LISTA } from '@/data/enigmas';
import SlidingPuzzle from '@/components/SlidingPuzzle';
import { useGame } from '@/contexts/GameContext';
import { useInspectComment } from '@/hooks/useInspectComment';

const INSPECT_MESSAGES_BY_SLUG: Record<string, string> = {
  cofre: 'A resposta está na url...',
};

const ERROR_MESSAGE_DURATION_MS = 3000;

function normalizeInput(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s,;]+/g, '')
    .toUpperCase()
    .trim();
}

function getIncorrectAnswerMessage(slug: string, attempt: number, input: string): string | null {
  if (slug === 'cofre') {
    if (attempt === 1) {
      return 'Hm… Essa é só a primeira sala e você já errou? Esperava mais de você. Bom, aqui vai mais uma dica já que sou boazinha: é uma senha com letras, números e caracteres especiais. Você já viu ela antes…';
    }

    if (attempt === 2) {
      return 'A url contém outra dica :).';
    }

    return 'Hm… tenta pensar um pouquinho mais ;).';
  }

  if (slug === 'festa') {
    if (attempt === 1) {
      return 'A resposta está na imagem, tudo junto, e sem hastag ;).';
    }

    return 'Hm… tenta pensar um pouquinho mais ;).';
  }

  if (slug === 'amongus') {
    const normalizedInput = normalizeInput(input);
    const obviousInputs = new Set(['ABACAXILIVROFONE']);
    const nathanielInputs = new Set(['NATHANIEL', 'NATH', 'NATHANIELCARELLO', 'LOIROBURRO']);

    if (obviousInputs.has(normalizedInput)) {
      return 'Não é tão óbvio assim… Apesar de estar na ordem correta, essa não é a resposta. Mas é o caminho.';
    }

    if (nathanielInputs.has(normalizedInput)) {
      return "Quase isso. Ele pensou que ‘abacaxi’ fosse ‘abelha’, por isso disse que era pequeno.";
    }

    return 'A url contém uma dica. Pense um pouquinho mais ;).';
  }

  if (slug === 'tucupi') {
    if (attempt === 1) {
      return 'Você já deve ter percebido que são cardápios. Agora, o que será que está faltando neles?';
    }

    if (attempt === 2) {
      return 'A url é um prato feito com a resposta.';
    }

    return 'A Ysaline ficaria muito triste…';
  }

  if (slug === 'presciencia') {
    const normalizedInput = normalizeInput(input);
    const hyunInputs = new Set(['HYUN', 'SOHNHYUN', 'HYUNSOHN']);

    if (hyunInputs.has(normalizedInput)) {
      return 'Claramente ele está ali. O tweet dele. Tenta pensar mais um pouco… quem sabe revisitar a postagem te ajude? :).';
    }

    if (attempt === 1) {
      return 'Você sabe o que PRESCIÊNCIA significa?';
    }

    return 'Você lembra o que dizia o tweet?';
  }

  if (slug === 'vote') {
    const normalizedInput = normalizeInput(input);
    const danicaInputs = new Set(['DANICA', 'DANICABALIAN', 'DANICAJONES']);
    const kianInputs = new Set(['KIAN', 'KIANAMORETTI', 'KIANMORETTI', 'PROJETOMBRE']);
    const jakeInputs = new Set(['JAKE']);
    const hackerInputs = new Set(['HACKER']);
    const jadeInputs = new Set(['JADE', 'JADEBEAULIEU']);
    const insultInputs = new Set([
      'PORRA',
      'BUCETA',
      'CARALHO',
      'FDP',
      'FILHODAPUTA',
      'FILHADAPUTA',
      'MALDITA',
      'CORNA',
      'MORRE',
      'CAPETA',
      'BURRA',
      'INFERNO',
      'DIABO',
      'PUTA',
      'VAGABUNDA',
      'PRAGA',
      'DEFUNTA',
      'OTARIA',
      'IDIOTA',
      'DESGRACADA',
      'DESGRACA',
      'TRAIDORA',
      'X9',
      'XISNOVE',
      'DIABA',
      'FALSA',
      'FALSIANE',
      'PQP',
      'PUTAQUEPARIU',
      'SMT',
      'SEMATA',
    ]);

    if (danicaInputs.has(normalizedInput)) {
      return 'Pra quem só tem um martelo, tudo se parece com um prego.';
    }

    if (kianInputs.has(normalizedInput)) {
      return 'Você se acha esperto, né?';
    }

    if (jakeInputs.has(normalizedInput)) {
      return 'Tão desesperado em encontrar a resposta que começou a inventar nomes… Patético, eu esperava mais de você.';
    }

    if (hackerInputs.has(normalizedInput)) {
      return 'O Thomas? O Armin? O Saeyoung? Ao menos seja mais específico, caramba.';
    }

    if (jadeInputs.has(normalizedInput)) {
      return 'Não.';
    }

    if (insultInputs.has(normalizedInput)) {
      return 'Tão desesperados… Como eu trabalhei com gentinha assim por tanto tempo? Hahahaha.';
    }

    return 'Vamos lá… Eu só preciso de um NOME. É tão difícil assim?';
  }

  return null;
}

export default function Puzzle() {
  const [match, params] = useRoute('/room1/:slug');
  const [, navigate] = useLocation();
  const { mode, timeRemaining, isTimeUp, completedPuzzles, markPuzzleComplete, endGame, puzzleStates } = useGame();

  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [wrongAttemptsBySlug, setWrongAttemptsBySlug] = useState<Record<string, number>>({});

  const slug = params?.slug;
  const currentPuzzle = slug ? obterEnigma(slug) : null;
  const puzzleRef = useRef<HTMLDivElement>(null);

  const inspectMessage = useMemo(() => {
    if (!slug) return null;
    return INSPECT_MESSAGES_BY_SLUG[slug] ?? null;
  }, [slug]);

  useInspectComment(puzzleRef, inspectMessage);

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

  useEffect(() => {
    setErrorMessage('');
  }, [slug]);

  const registerWrongAttempt = (puzzleSlug: string, input: string): string => {
    const nextAttempt = (wrongAttemptsBySlug[puzzleSlug] ?? 0) + 1;
    setWrongAttemptsBySlug((current) => ({
      ...current,
      [puzzleSlug]: nextAttempt,
    }));

    return getIncorrectAnswerMessage(puzzleSlug, nextAttempt, input) ?? '❌ SENHA INCORRETA!';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação especial para o enigma 'festa' no modo Hard
    if (mode === 'hard' && slug === 'festa') {
      const isPuzzleComplete = puzzleStates.get('festa') === true;
      const isAnswerCorrect = validarResposta(slug, userAnswer);

      if (!isPuzzleComplete) {
        setErrorMessage('❌ O PUZZLE NÃO ESTÁ COMPLETO!');
        setTimeout(() => {
          navigate('/room1/cofre');
          setErrorMessage('');
        }, ERROR_MESSAGE_DURATION_MS);
        return;
      }

      if (!isAnswerCorrect) {
        setErrorMessage(registerWrongAttempt(slug, userAnswer));
        setTimeout(() => {
          navigate('/room1/cofre');
          setErrorMessage('');
        }, ERROR_MESSAGE_DURATION_MS);
        return;
      }

      // Se passou em ambas as validações
      setIsCorrect(true);
      markPuzzleComplete(slug);
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
      return;
    }

    // Lógica padrão para outros enigmas e modo Normal
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
    } else if (mode === 'hard') {
      // Punição para erro de senha em modo Hard (outros enigmas)
      setErrorMessage(registerWrongAttempt(slug!, userAnswer));
      setTimeout(() => {
        navigate('/room1/cofre');
        setErrorMessage('');
      }, ERROR_MESSAGE_DURATION_MS);
    } else {
      setErrorMessage(registerWrongAttempt(slug!, userAnswer));
      setTimeout(() => {
        setErrorMessage('');
      }, ERROR_MESSAGE_DURATION_MS);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentPuzzle) return null;

  return (
    <div ref={puzzleRef} className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16">
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

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-8 px-5 py-4 border-2 border-red-500 bg-red-900/20 text-center" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.04em',
            color: '#fca5a5'
          }}>
            <p className="text-sm leading-relaxed">{errorMessage}</p>
          </div>
        )}

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
        ) : slug === 'presciencia' ? (
          <div className="mb-12 flex justify-center">
            <img
              src={currentPuzzle.question}
              alt="Cartão do enigma Presciência"
              className="w-full max-w-md h-auto"
            />
          </div>
        ) : slug === 'vote' ? (
          <div className="mb-12 border border-white/60 bg-black p-6 md:p-8" style={{
            fontFamily: "'Space Mono', monospace"
          }}>
            <div className="text-white/80 mb-4">------------------------------------------------------------</div>
            <p className="text-lg md:text-xl text-left tracking-wide">
              INPUT_NAME:
            </p>
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
            <SlidingPuzzle gridSize={3} puzzleSlug="festa" />
          </div>
        )}

        {/* Answer form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
          <label className="text-sm" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.7)'
          }}>
            {slug === 'vote' ? 'INPUT NAME' : 'INSIRA A SENHA'}
          </label>
          <div className="relative">
            <input
              type={slug === 'vote' ? 'text' : showPassword ? 'text' : 'password'}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder={slug === 'vote' ? 'Type here...' : '••••••••••••••••'}
              disabled={isCorrect}
              className={`w-full px-4 py-4 ${slug === 'vote' ? '' : 'pr-12'} bg-gray-900 border-2 border-white text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors disabled:opacity-50`}
              style={{
                fontFamily: "'Space Mono', monospace",
                letterSpacing: '0.05em',
                textTransform: slug === 'vote' ? 'none' : 'uppercase'
              }}
            />
            {slug !== 'vote' && (
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
            )}
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
