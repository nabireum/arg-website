/**
 * SLIDING PUZZLE COMPONENT - Quebra-Cabeça Deslizante 5x5
 * 
 * Componente que implementa um puzzle deslizante (15-puzzle adaptado para 5x5).
 * O jogador clica nas peças para deslizá-las até montar a imagem correta.
 * 
 * Props:
 * - imageUrl: URL da imagem do puzzle
 * - gridSize: Tamanho da grade (ex: 5 para 5x5)
 * - onComplete: Callback quando o puzzle é completado
 */

import React, { useState, useEffect } from 'react';

interface SlidingPuzzleProps {
  imageUrl: string;
  gridSize: number;
  onComplete?: () => void;
}

interface Tile {
  id: number;
  correctPosition: number;
}

export default function SlidingPuzzle({ imageUrl, gridSize, onComplete }: SlidingPuzzleProps) {
  // ==================== ESTADO ====================
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const totalTiles = gridSize * gridSize;
  const emptyTileId = totalTiles - 1;

  // ==================== INICIALIZAR PUZZLE ====================
  useEffect(() => {
    initializePuzzle();
  }, [gridSize]);

  const initializePuzzle = () => {
    // Cria array com IDs das peças [0, 1, 2, ..., 24]
    const initialTiles = Array.from({ length: totalTiles }, (_, i) => i);

    // Embaralha o puzzle
    const shuffled = shufflePuzzle([...initialTiles]);
    setTiles(shuffled);
    setMoves(0);
    setIsComplete(false);
  };

  // ==================== FUNÇÃO: Embaralhar puzzle ====================
  const shufflePuzzle = (initialTiles: number[]) => {
    const shuffled = [...initialTiles];
    
    // Faz 200 movimentos aleatórios para embaralhar
    for (let i = 0; i < 200; i++) {
      const emptyIndex = shuffled.indexOf(emptyTileId);
      const neighbors = getNeighbors(emptyIndex);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

      // Troca a peça vazia com um vizinho
      [shuffled[emptyIndex], shuffled[randomNeighbor]] = [
        shuffled[randomNeighbor],
        shuffled[emptyIndex],
      ];
    }
    return shuffled;
  };

  // ==================== FUNÇÃO: Obter vizinhos ====================
  const getNeighbors = (index: number): number[] => {
    const neighbors: number[] = [];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    // Cima
    if (row > 0) neighbors.push(index - gridSize);
    // Baixo
    if (row < gridSize - 1) neighbors.push(index + gridSize);
    // Esquerda
    if (col > 0) neighbors.push(index - 1);
    // Direita
    if (col < gridSize - 1) neighbors.push(index + 1);

    return neighbors;
  };

  // ==================== FUNÇÃO: Clicar em uma peça ====================
  const handleTileClick = (index: number) => {
    if (isComplete) return;

    const emptyIndex = tiles.indexOf(emptyTileId);
    const neighbors = getNeighbors(emptyIndex);

    // Verifica se a peça clicada é vizinha da peça vazia
    if (neighbors.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(moves + 1);

      // Verifica se o puzzle foi completado
      if (isPuzzleComplete(newTiles)) {
        setIsComplete(true);
        onComplete?.();
      }
    }
  };

  // ==================== FUNÇÃO: Verificar se puzzle está completo ====================
  const isPuzzleComplete = (currentTiles: number[]): boolean => {
    return currentTiles.every((tile, index) => tile === index);
  };

  // ==================== RENDERIZAÇÃO ====================
  const tileSize = 100 / gridSize;
  // Tamanho dinâmico do grid baseado em gridSize
  const gridPixelSize = gridSize === 3 ? 300 : 400;

  // Não renderizar até o puzzle estar inicializado
  if (tiles.length === 0) {
    return <div className="text-center text-white">Carregando puzzle...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* ==================== INFORMAÇÕES ====================  */}
      <div className="text-center">
        <p className="text-sm" style={{
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.05em',
          color: 'rgba(255,255,255,0.6)'
        }}>
          MOVIMENTOS: {moves}
        </p>
        {isComplete && (
          <p className="text-sm mt-2" style={{
            fontFamily: "'Space Mono', monospace",
            letterSpacing: '0.05em',
            color: '#22c55e'
          }}>
            ✓ PUZZLE COMPLETO!
          </p>
        )}
      </div>

      {/* ==================== GRID DO PUZZLE ====================  */}
      <div
        className="relative bg-black border-2 border-white"
        style={{
          width: `${gridPixelSize}px`,
          height: `${gridPixelSize}px`,
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: '2px',
          padding: '2px',
          backgroundColor: '#000000',
        }}
      >
        {tiles.map((tileId, index) => {
          const isEmpty = tileId === emptyTileId;
          const correctRow = Math.floor(tileId / gridSize);
          const correctCol = tileId % gridSize;

          return (
            <div
              key={index}
              onClick={() => handleTileClick(index)}
              className={`cursor-pointer transition-all duration-200 ${
                isEmpty ? 'bg-black' : 'bg-gray-800 hover:bg-gray-700 border border-white'
              }`}
              style={{
                backgroundImage: isEmpty ? 'none' : `url('${imageUrl}')`,
                backgroundPosition: `${correctCol * tileSize}% ${correctRow * tileSize}%`,
                backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
                backgroundRepeat: 'no-repeat',
                cursor: isEmpty ? 'default' : 'pointer',
                opacity: isEmpty ? 0.3 : 1,
              }}
            />
          );
        })}
      </div>

      {/* ==================== BOTÃO RESET ====================  */}
      <button
        onClick={initializePuzzle}
        className="px-4 py-2 border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-100 text-sm"
        style={{
          fontFamily: "'Space Mono', monospace",
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}
      >
        EMBARALHAR NOVAMENTE
      </button>
    </div>
  );
}
