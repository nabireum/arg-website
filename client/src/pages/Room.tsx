import { useLocation } from 'wouter';
import { useEffect } from 'react';

export default function Room() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // Change page title to "404..."
    document.title = '404...';
  }, []);

  return (
    <div className="min-h-screen bg-white text-black p-8" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="max-w-3xl">
        {/* Header with info icon */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 border-2 border-blue-600 flex items-center justify-center flex-shrink-0"
            style={{ fontSize: '14px', fontWeight: 'bold', color: '#0066CC' }}
          >
            i
          </div>
          <h1 className="text-2xl font-bold text-gray-800">A página não pode ser encontrada</h1>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-6 leading-relaxed">
          A página que você está procurando pode ter sido removida, teve seu nome alterado ou está temporariamente indisponível.
        </p>

        {/* Separator line */}
        <hr className="border-gray-300 my-6" />

        {/* Instructions */}
        <p className="text-gray-800 font-semibold mb-4">Por favor, tente o seguinte:</p>

        <ul className="space-y-3 mb-8 text-gray-700">
          <li className="flex gap-3">
            <span className="flex-shrink-0">•</span>
            <span>
              Se você digitou o endereço da página na barra de endereços, certifique-se de que ele está escrito corretamente.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0">•</span>
            <span>
              Abrir o{' '}
              <a
                href="/"
                className="text-red-600 underline hover:text-red-700"
              >
                https://segredobalian.space
              </a>
              página inicial, e depois procure links para as informações que deseja.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0">•</span>
            <span>
              Clique o{' '}
              <button
                onClick={() => window.history.back()}
                className="text-red-600 underline hover:text-red-700 bg-transparent border-none cursor-pointer p-0"
              >
                De volta
              </button>
              {' '}botão para tentar outro link.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0">•</span>
            <span>
              Click{' '}
              <button
                className="text-red-600 underline hover:text-red-700 bg-transparent border-none cursor-pointer p-0"
              >
                Procurar
              </button>
              {' '}para buscar informações na Internet.
            </span>
          </li>
        </ul>

        {/* Footer */}
        <div className="text-gray-600 text-sm">
          <p>HTTP 404 - Arquivo não encontrado</p>
          <p>Internet Explorer</p>
        </div>
      </div>
    </div>
  );
}
