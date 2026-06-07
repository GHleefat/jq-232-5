import { useEffect, useRef } from 'react';
import type { GameState } from '../types/game';
import { GRID_ROWS, GRID_COLS, CELL_SIZE } from '../utils/gameUtils';

interface GameCanvasProps {
  gameState: GameState;
}

const COLORS = {
  grassDark: '#4CAF50',
  grassLight: '#66BB6A',
  grassLighter: '#81C784',
  mowedDark: '#2E7D32',
  mowedLight: '#388E3C',
  mowedLighter: '#43A047',
  path: '#8D6E63',
  pathLight: '#A1887F',
  flower: '#E91E63',
  flowerAlt: '#FF9800',
  flowerLeaf: '#4CAF50',
  mowerBody: '#FF5722',
  mowerDark: '#E64A19',
  mowerWheel: '#37474F',
  mowerBlade: '#9E9E9E',
};

export function GameCanvas({ gameState }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = GRID_COLS * CELL_SIZE;
    const height = GRID_ROWS * CELL_SIZE;

    ctx.clearRect(0, 0, width, height);

    for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        const cell = gameState.grid[y][x];
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;

        if (cell.type === 'path') {
          ctx.fillStyle = y % 2 === 0 ? COLORS.path : COLORS.pathLight;
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          ctx.fillStyle = 'rgba(0,0,0,0.05)';
          for (let i = 0; i < 3; i++) {
            ctx.fillRect(px + 4 + i * 10, py + CELL_SIZE / 2 - 1, 6, 2);
          }
        } else if (cell.type === 'flower') {
          const baseColor = (x + y) % 2 === 0 ? COLORS.grassLight : COLORS.grassLighter;
          ctx.fillStyle = baseColor;
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

          const cx = px + CELL_SIZE / 2;
          const cy = py + CELL_SIZE / 2;
          const petalColor = (x * 3 + y * 7) % 3 === 0 ? COLORS.flower : COLORS.flowerAlt;

          ctx.fillStyle = petalColor;
          for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const petalX = cx + Math.cos(angle) * 6;
            const petalY = cy + Math.sin(angle) * 6;
            ctx.beginPath();
            ctx.arc(petalX, petalY, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#FFEB3B';
          ctx.beginPath();
          ctx.arc(cx, cy, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (cell.type === 'grass') {
          const h = cell.grassHeight;
          if (h === 3) {
            ctx.fillStyle = COLORS.grassDark;
          } else if (h === 2) {
            ctx.fillStyle = COLORS.grassLight;
          } else {
            ctx.fillStyle = COLORS.grassLighter;
          }
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

          ctx.fillStyle = 'rgba(46, 125, 50, 0.3)';
          const seed = x * 13 + y * 7;
          for (let i = 0; i < 4 + h; i++) {
            const gx = px + 3 + ((seed + i * 11) % (CELL_SIZE - 6));
            const gy = py + 4 + ((seed * 3 + i * 7) % (CELL_SIZE - 8));
            ctx.fillRect(gx, gy, 1, 3 + h);
          }
        } else if (cell.type === 'mowed') {
          const isEvenRow = (cell.mowedRow ?? y) % 2 === 0;
          const isEvenCol = (cell.mowedCol ?? x) % 2 === 0;

          if (isEvenRow) {
            ctx.fillStyle = isEvenCol ? COLORS.mowedDark : COLORS.mowedLight;
          } else {
            ctx.fillStyle = isEvenCol ? COLORS.mowedLight : COLORS.mowedLighter;
          }
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

          ctx.strokeStyle = 'rgba(255,255,255,0.08)';
          ctx.lineWidth = 1;
          for (let i = 0; i < CELL_SIZE; i += 4) {
            ctx.beginPath();
            ctx.moveTo(px, py + i);
            ctx.lineTo(px + CELL_SIZE, py + i);
            ctx.stroke();
          }
        }

        ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px + 0.5, py + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
      }
    }

    const mower = gameState.mower;
    const mx = mower.x * CELL_SIZE;
    const my = mower.y * CELL_SIZE;
    const cx = mx + CELL_SIZE / 2;
    const cy = my + CELL_SIZE / 2;

    ctx.save();
    ctx.translate(cx, cy);

    let rotation = 0;
    switch (mower.direction) {
      case 'right':
        rotation = 0;
        break;
      case 'down':
        rotation = Math.PI / 2;
        break;
      case 'left':
        rotation = Math.PI;
        break;
      case 'up':
        rotation = -Math.PI / 2;
        break;
    }
    ctx.rotate(rotation);

    ctx.fillStyle = COLORS.mowerBlade;
    ctx.fillRect(-CELL_SIZE / 2 + 2, -5, CELL_SIZE - 4, 10);

    ctx.fillStyle = COLORS.mowerBody;
    ctx.fillRect(-CELL_SIZE / 2 + 4, -CELL_SIZE / 3, CELL_SIZE - 12, (CELL_SIZE * 2) / 3);

    ctx.fillStyle = COLORS.mowerDark;
    ctx.fillRect(-CELL_SIZE / 2 + 4, CELL_SIZE / 3 - 4, CELL_SIZE - 12, 4);

    ctx.fillStyle = COLORS.mowerWheel;
    ctx.beginPath();
    ctx.arc(-CELL_SIZE / 2 + 6, -CELL_SIZE / 3 + 3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-CELL_SIZE / 2 + 6, CELL_SIZE / 3 - 3, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#546E7A';
    ctx.beginPath();
    ctx.arc(-CELL_SIZE / 2 + 6, -CELL_SIZE / 3 + 3, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-CELL_SIZE / 2 + 6, CELL_SIZE / 3 - 3, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌿', 0, 0);

    ctx.restore();
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={GRID_COLS * CELL_SIZE}
      height={GRID_ROWS * CELL_SIZE}
      className="rounded-2xl shadow-2xl border-4 border-green-800/30"
    />
  );
}
