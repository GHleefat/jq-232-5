import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Pencil,
  Flower2,
  Footprints,
  Eraser,
  RotateCcw,
  Shuffle,
  Play,
  ArrowLeft,
  Leaf,
  AlertTriangle,
} from 'lucide-react';
import type { Cell, EditorTool, CustomGridConfig } from '../types/game';
import {
  GRID_ROWS,
  GRID_COLS,
  CELL_SIZE,
  createEmptyGrid,
  findStartPosition,
  countGrassCells,
  createInitialGrid,
} from '../utils/gameUtils';

interface YardEditorProps {
  onStartGame: (config: CustomGridConfig) => void;
  onBack: () => void;
}

const TOOL_COLORS: Record<EditorTool, string> = {
  grass: '#66BB6A',
  flower: '#E91E63',
  path: '#8D6E63',
  eraser: '#9E9E9E',
};

const TOOL_LABELS: Record<EditorTool, string> = {
  grass: '草地',
  flower: '花坛',
  path: '小路',
  eraser: '草地',
};

export function YardEditor({ onStartGame, onBack }: YardEditorProps) {
  const [grid, setGrid] = useState<Cell[][]>(() => createEmptyGrid());
  const [tool, setTool] = useState<EditorTool>('flower');
  const [isPainting, setIsPainting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const grassCount = countGrassCells(grid);
  const flowerCount = grid.flat().filter((c) => c.type === 'flower').length;
  const pathCount = grid.flat().filter((c) => c.type === 'path').length;
  const canStart = grassCount > 0;

  const paintCell = useCallback(
    (x: number, y: number) => {
      if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) return;
      setGrid((prev) => {
        const newGrid = prev.map((row) => row.map((cell) => ({ ...cell })));
        const cell = newGrid[y][x];

        if (tool === 'eraser' || tool === 'grass') {
          if (cell.type !== 'grass') {
            newGrid[y][x] = {
              type: 'grass',
              grassHeight: 2 + Math.floor(Math.random() * 2),
              mowedRow: null,
              mowedCol: null,
            };
          }
        } else if (tool === 'flower') {
          if (cell.type !== 'flower') {
            newGrid[y][x] = {
              ...cell,
              type: 'flower',
            };
          }
        } else if (tool === 'path') {
          if (cell.type !== 'path') {
            newGrid[y][x] = {
              ...cell,
              type: 'path',
            };
          }
        }
        return newGrid;
      });
    },
    [tool]
  );

  const getCellFromEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    const x = Math.floor(px / CELL_SIZE);
    const y = Math.floor(py / CELL_SIZE);
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPainting(true);
    const pos = getCellFromEvent(e);
    if (pos) paintCell(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting) return;
    const pos = getCellFromEvent(e);
    if (pos) paintCell(pos.x, pos.y);
  };

  const handleMouseUp = () => {
    setIsPainting(false);
  };

  const handleMouseLeave = () => {
    setIsPainting(false);
  };

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
        const cell = grid[y][x];
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;

        if (cell.type === 'path') {
          ctx.fillStyle = y % 2 === 0 ? '#8D6E63' : '#A1887F';
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);
          ctx.fillStyle = 'rgba(0,0,0,0.05)';
          for (let i = 0; i < 3; i++) {
            ctx.fillRect(px + 4 + i * 10, py + CELL_SIZE / 2 - 1, 6, 2);
          }
        } else if (cell.type === 'flower') {
          const baseColor = (x + y) % 2 === 0 ? '#66BB6A' : '#81C784';
          ctx.fillStyle = baseColor;
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

          const cx = px + CELL_SIZE / 2;
          const cy = py + CELL_SIZE / 2;
          const petalColor = (x * 3 + y * 7) % 3 === 0 ? '#E91E63' : '#FF9800';

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
        } else {
          const h = cell.grassHeight;
          if (h === 3) {
            ctx.fillStyle = '#4CAF50';
          } else if (h === 2) {
            ctx.fillStyle = '#66BB6A';
          } else {
            ctx.fillStyle = '#81C784';
          }
          ctx.fillRect(px, py, CELL_SIZE, CELL_SIZE);

          ctx.fillStyle = 'rgba(46, 125, 50, 0.3)';
          const seed = x * 13 + y * 7;
          for (let i = 0; i < 4 + h; i++) {
            const gx = px + 3 + ((seed + i * 11) % (CELL_SIZE - 6));
            const gy = py + 4 + ((seed * 3 + i * 7) % (CELL_SIZE - 8));
            ctx.fillRect(gx, gy, 1, 3 + h);
          }
        }

        ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(px + 0.5, py + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
      }
    }
  }, [grid]);

  const handleClear = () => {
    setGrid(createEmptyGrid());
  };

  const handleRandom = () => {
    const config = createInitialGrid();
    setGrid(config.grid);
  };

  const handleStart = () => {
    if (!canStart) return;
    const { startX, startY } = findStartPosition(grid);
    const config: CustomGridConfig = {
      grid: grid.map((row) => row.map((cell) => ({ ...cell }))),
      totalGrassCells: grassCount,
      startX,
      startY,
    };
    onStartGame(config);
  };

  const tools: { id: EditorTool; icon: React.ReactNode; label: string }[] = [
    { id: 'flower', icon: <Flower2 className="w-5 h-5" />, label: '花坛' },
    { id: 'path', icon: <Footprints className="w-5 h-5" />, label: '小路' },
    { id: 'grass', icon: <Leaf className="w-5 h-5" />, label: '草地' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow border border-green-200 mb-4 hover:bg-white transition-colors text-green-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            返回游戏
          </button>
          <div>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-green-200 mb-4">
              <Pencil className="w-6 h-6 text-green-600" />
              <h1 className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                院子编辑器
              </h1>
              <Pencil className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-green-700/80 font-medium">
              自由设计你的专属院子，放置花坛和小路作为障碍物 🎨
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          <div className="flex-shrink-0">
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-green-100">
              <canvas
                ref={canvasRef}
                width={GRID_COLS * CELL_SIZE}
                height={GRID_ROWS * CELL_SIZE}
                className="rounded-xl cursor-crosshair border-2 border-green-200 select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              />
            </div>
          </div>

          <div className="w-full lg:w-72 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-green-100">
              <p className="text-sm font-bold text-gray-700 mb-3">选择画笔</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {tools.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTool(t.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                      tool === t.id
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg scale-[1.02]'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {t.icon}
                    <span className="text-xs font-bold">{t.label}</span>
                  </button>
                ))}
              </div>
              <div
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 border border-gray-200"
              >
                <div
                  className="w-6 h-6 rounded-md border-2 border-white shadow"
                  style={{ backgroundColor: TOOL_COLORS[tool] }}
                />
                <span className="text-sm text-gray-600">
                  当前：<span className="font-bold">{TOOL_LABELS[tool]}</span>
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg border border-green-100">
              <p className="text-sm font-bold text-gray-700 mb-3">地图统计</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                  <div className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-gray-600">草地</span>
                  </div>
                  <span className="text-sm font-bold text-green-700">{grassCount} 格</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-pink-50">
                  <div className="flex items-center gap-2">
                    <Flower2 className="w-4 h-4 text-pink-600" />
                    <span className="text-sm text-gray-600">花坛</span>
                  </div>
                  <span className="text-sm font-bold text-pink-700">{flowerCount} 格</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50">
                  <div className="flex items-center gap-2">
                    <Footprints className="w-4 h-4 text-amber-700" />
                    <span className="text-sm text-gray-600">小路</span>
                  </div>
                  <span className="text-sm font-bold text-amber-800">{pathCount} 格</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-lg border border-green-100 space-y-3">
              <button
                onClick={handleRandom}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-bold py-3 rounded-xl shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Shuffle className="w-4 h-4" />
                随机生成
              </button>
              <button
                onClick={handleClear}
                className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-3 rounded-xl shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4" />
                清空重置
              </button>
            </div>

            {!canStart && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  至少需要 1 格草地才能开始游戏哦！
                </p>
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={!canStart}
              className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl shadow-lg transition-all ${
                canStart
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Play className="w-5 h-5" />
              开始挑战
            </button>

            <p className="text-center text-xs text-green-700/60 leading-relaxed">
              💡 提示：点击或拖拽鼠标在画布上绘制<br />
              割草机将从第一块草地位置开始
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
