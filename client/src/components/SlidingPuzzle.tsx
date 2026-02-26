import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';

interface SlidingPuzzleProps {
  gridSize: number;
  onComplete?: () => void;
  puzzleSlug?: string;
}

export default function SlidingPuzzle({ gridSize = 3, onComplete, puzzleSlug = 'festa' }: SlidingPuzzleProps) {
  const { setPuzzleComplete } = useGame();
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const totalTiles = gridSize * gridSize;
  const emptyTileId = totalTiles - 1;

  useEffect(() => {
    initializePuzzle();
  }, [gridSize]);

  const getNeighbors = (index: number): number[] => {
    const neighbors: number[] = [];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    if (row > 0) neighbors.push(index - gridSize);
    if (row < gridSize - 1) neighbors.push(index + gridSize);
    if (col > 0) neighbors.push(index - 1);
    if (col < gridSize - 1) neighbors.push(index + 1);
    return neighbors;
  };

  const shufflePuzzle = (initialTiles: number[]) => {
    const shuffled = [...initialTiles];
    let emptyIndex = shuffled.indexOf(emptyTileId);

    for (let i = 0; i < 200; i++) {
      const neighbors = getNeighbors(emptyIndex);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [shuffled[emptyIndex], shuffled[randomNeighbor]] = [shuffled[randomNeighbor], shuffled[emptyIndex]];
      emptyIndex = randomNeighbor;
    }
    return shuffled;
  };

  const initializePuzzle = () => {
    const initialTiles = Array.from({ length: totalTiles }, (_, i) => i);
    setTiles(shufflePuzzle([...initialTiles]));
    setMoves(0);
    setIsComplete(false);
    setPuzzleComplete(puzzleSlug, false);
  };

  const isPuzzleComplete = (currentTiles: number[]): boolean => {
    return currentTiles.every((tile, index) => tile === index);
  };

  const handleTileClick = (index: number) => {
    if (isComplete) return;
    const emptyIndex = tiles.indexOf(emptyTileId);
    const neighbors = getNeighbors(emptyIndex);
    if (neighbors.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(moves + 1);
      if (isPuzzleComplete(newTiles)) {
        setIsComplete(true);
        setPuzzleComplete(puzzleSlug, true);
        onComplete?.();
      }
    }
  };

  // Proporção original da imagem: 426x603 (142x201 por tile)
  const tileWidth = 142;
  const tileHeight = 201;
  const gridPixelWidth = tileWidth * gridSize;
  const gridPixelHeight = tileHeight * gridSize;

  if (tiles.length === 0) {
    return <div className="text-center text-white">Carregando puzzle...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6">
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

      <div
        style={{
          width: `${gridPixelWidth}px`,
          height: `${gridPixelHeight}px`,
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, ${tileWidth}px)`,
          gridTemplateRows: `repeat(${gridSize}, ${tileHeight}px)`,
          gap: '2px',
          backgroundColor: '#000000',
          border: '2px solid white',
        }}
      >
        {tiles.map((tileId, index) => {
          const isEmpty = tileId === emptyTileId;

          return (
            <div
              key={index}
              onClick={() => handleTileClick(index)}
              style={{
                width: `${tileWidth}px`,
                height: `${tileHeight}px`,
                backgroundImage: isEmpty ? 'none' : `url('/puzzle-tiles/tile_${tileId}.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                cursor: isEmpty ? 'default' : 'pointer',
                opacity: isEmpty ? 0.3 : 1,
                backgroundColor: '#000000',
                border: isEmpty ? 'none' : '1px solid rgba(255,255,255,0.3)',
                transition: 'opacity 0.2s',
              }}
            />
          );
        })}
      </div>

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
