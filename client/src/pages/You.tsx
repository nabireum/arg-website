import { useEffect, useMemo, useState } from 'react';

const REVEAL_LINES = [
  '(Parabéns por completar o modo dificil.)',
  '(Vamos te recompensar pelo seu trabalho duro)',
  '(Todo o seu esforço.)',
  '(Por conta disso, você deve ser)',
  '(Recompensado)',
  '(Uma pergunta.)',
  '(Digite o que você deseja saber)',
  '(E será revelado a você)',
  '(De um jeito ou de Outro.)',
];

const THANK_YOU_LINES = [
  '(Obrigado pela sua cooperação.)',
  '(Nos veremos muito, muito em breve.)',
];

const REVEAL_INTERVAL_MS = 2500;

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default function You() {
  const [revealedCount, setRevealedCount] = useState(0);
  const [question, setQuestion] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const completionSeconds = useMemo(() => {
    const raw = sessionStorage.getItem('hardmodeCompletionSeconds');
    const parsed = raw ? Number.parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRevealedCount((count) => {
        if (count >= REVEAL_LINES.length) {
          window.clearInterval(interval);
          return count;
        }
        return count + 1;
      });
    }, REVEAL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError('');

    if (!question.trim() || !name.trim()) {
      setSubmitError('Preencha sua pergunta e seu nome.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/hardmode-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          name: name.trim(),
          completionSeconds,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar resposta.');
      }

      setIsSubmitted(true);
      sessionStorage.removeItem('hardmodeRewardUnlocked');
    } catch (error) {
      setSubmitError('Não foi possível enviar agora. Tente novamente em instantes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-white px-6 py-14"
      style={{ fontFamily: "'Press Start 2P', 'VT323', 'IBM Plex Mono', monospace" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-5 text-white" style={{ color: '#fcfcfc', lineHeight: 1.8 }}>
          {REVEAL_LINES.slice(0, revealedCount).map((line) => (
            <p key={line} className="text-sm md:text-base tracking-wide">
              {line}
            </p>
          ))}
        </div>

        {revealedCount >= REVEAL_LINES.length && !isSubmitted && (
          <form onSubmit={handleSubmit} className="mt-12 space-y-6 max-w-3xl">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-white/85">Sua pergunta</label>
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={4}
                className="w-full bg-[#0f0f0f] border border-white/30 px-4 py-3 text-sm text-white focus:outline-none focus:border-white"
                placeholder="Digite o que você deseja saber..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-white/85">Seu Nome</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full bg-[#0f0f0f] border border-white/30 px-4 py-3 text-sm text-white focus:outline-none focus:border-white"
                placeholder="Digite seu nome"
              />
            </div>

            <div className="text-xs text-white/60">
              Tempo no hard mode:{' '}
              {completionSeconds !== null ? formatDuration(completionSeconds) : 'indisponível'}
            </div>

            {submitError && <p className="text-xs text-red-300">{submitError}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="border border-white px-6 py-3 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
        )}

        {isSubmitted && (
          <div className="mt-12 space-y-4">
            {THANK_YOU_LINES.map((line) => (
              <p key={line} className="text-sm md:text-base tracking-wide text-white">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
