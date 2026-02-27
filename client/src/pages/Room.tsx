import { useLocation } from 'wouter';

export default function Room() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        <p
          className="text-sm md:text-base tracking-[0.1em] text-white/70 mb-8"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Você entrou na sala...
        </p>
        
        <h1
          className="text-3xl md:text-5xl font-bold tracking-[0.2em] mb-12"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          AGUARDANDO CONTEÚDO
        </h1>

        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 border-2 border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-100"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
