import { useState, useEffect, useRef } from 'react';

interface SlidingPuzzleProps {
  imageUrl: string;
  gridSize: number;
  onComplete?: () => void;
}

export default function SlidingPuzzle({ imageUrl, gridSize, onComplete }: SlidingPuzzleProps) {
  const [tiles, setTiles] = useState<(string | null)[]>([]);
  const [originalTiles, setOriginalTiles] = useState<(string | null)[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const totalTiles = gridSize * gridSize;
  const emptyTileId = totalTiles - 1;

  useEffect(() => {
    const loadAndProcessImage = async () => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Redimensionar para um quadrado perfeito para facilitar o corte
          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;
          
          // Desenhar a imagem centralizada
          ctx.drawImage(
            img,
            (img.width - size) / 2,
            (img.height - size) / 2,
            size,
            size,
            0,
            0,
            size,
            size
          );

          const tileWidth = size / gridSize;
          const tileHeight = size / gridSize;

          const tileImages: (string | null)[] = [];
          for (let i = 0; i < totalTiles; i++) {
            if (i === emptyTileId) {
              tileImages.push(null);
            } else {
              const row = Math.floor(i / gridSize);
              const col = i % gridSize;

              const tileCanvas = document.createElement('canvas');
              tileCanvas.width = tileWidth;
              tileCanvas.height = tileHeight;
              const tileCtx = tileCanvas.getContext('2d');

              if (tileCtx) {
                tileCtx.drawImage(
                  canvas,
                  col * tileWidth,
                  row * tileHeight,
                  tileWidth,
                  tileHeight,
                  0,
                  0,
                  tileWidth,
                  tileHeight
                );
                tileImages.push(tileCanvas.toDataURL());
              }
            }
          }

          setOriginalTiles([...tileImages]);
          setTiles(shufflePuzzle([...tileImages]));
          setIsLoading(false);
        };
        img.src = imageUrl;
      } catch (error) {
        console.error('Erro ao carregar imagem:', error);
        setIsLoading(false);
      }
    };

    loadAndProcessImage();
  }, [imageUrl, gridSize, totalTiles, emptyTileId]);

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

  const shufflePuzzle = (initialTiles: (string | null)[]): (string | null)[] => {
    const shuffled = [...initialTiles];
    // Realizar movimentos válidos para garantir que o puzzle seja resolvível
    let emptyIndex = shuffled.indexOf(null);
    for (let i = 0; i < 200; i++) {
      const neighbors = getNeighbors(emptyIndex);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [shuffled[emptyIndex], shuffled[randomNeighbor]] = [shuffled[randomNeighbor], shuffled[emptyIndex]];
      emptyIndex = randomNeighbor;
    }
    return shuffled;
  };

  const initializePuzzle = () => {
    if (originalTiles.length > 0) {
      setTiles(shufflePuzzle([...originalTiles]));
      setMoves(0);
      setIsComplete(false);
    }
  };

  const isPuzzleComplete = (currentTiles: (string | null)[]): boolean => {
    return currentTiles.every((tile, index) => tile === originalTiles[index]);
  };

  const handleTileClick = (index: number) => {
    if (isComplete || isLoading) return;
    const emptyIndex = tiles.indexOf(null);
    const neighbors = getNeighbors(emptyIndex);
    if (neighbors.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(moves + 1);
      if (isPuzzleComplete(newTiles)) {
        setIsComplete(true);
        onComplete?.();
      }
    }
  };

  const gridPixelSize = 300; // Tamanho fixo para consistência
  const tilePixelSize = (gridPixelSize - (gridSize * 2)) / gridSize;

  if (isLoading || tiles.length === 0) {
    return <div className="text-center text-white">Carregando puzzle...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <canvas ref={canvasRef} style={{ display: 'none' }} />

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
        {tiles.map((tileImage, index) => {
          const isEmpty = tileImage === null;

          return (
            <div
              key={index}
              onClick={() => handleTileClick(index)}
              className={`cursor-pointer transition-all duration-200 ${
                isEmpty ? 'bg-black' : 'bg-gray-800 hover:bg-gray-700 border border-white'
              }`}
              style={{
                backgroundImage: isEmpty ? 'none' : `url('${tileImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                cursor: isEmpty ? 'default' : 'pointer',
                opacity: isEmpty ? 0.3 : 1,
                width: '100%',
                height: '100%',
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
