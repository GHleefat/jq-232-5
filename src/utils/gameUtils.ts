import type {
  Cell,
  GameState,
  Mower,
  PathPoint,
  ScoreResult,
  Direction,
  Achievement,
  CustomGridConfig,
} from "../types/game";

export const GRID_ROWS = 16;
export const GRID_COLS = 20;
export const CELL_SIZE = 36;

export function createEmptyGrid(): Cell[][] {
  const grid: Cell[][] = [];
  for (let y = 0; y < GRID_ROWS; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < GRID_COLS; x++) {
      row.push({
        type: "grass",
        grassHeight: 2 + Math.floor(Math.random() * 2),
        mowedRow: null,
        mowedCol: null,
      });
    }
    grid.push(row);
  }
  return grid;
}

export function findStartPosition(grid: Cell[][]): {
  startX: number;
  startY: number;
} {
  let startX = 0;
  let startY = 0;
  outer: for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      if (grid[y][x].type === "grass") {
        startX = x;
        startY = y;
        break outer;
      }
    }
  }
  return { startX, startY };
}

export function countGrassCells(grid: Cell[][]): number {
  let count = 0;
  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      if (grid[y][x].type === "grass") count++;
    }
  }
  return count;
}

export function createInitialGrid(): CustomGridConfig {
  const grid = createEmptyGrid();
  let totalGrassCells = GRID_ROWS * GRID_COLS;

  const flowerPatterns = [
    { x: 3, y: 2, w: 3, h: 2 },
    { x: 14, y: 3, w: 3, h: 2 },
    { x: 8, y: 11, w: 4, h: 2 },
    { x: 2, y: 8, w: 2, h: 2 },
  ];

  flowerPatterns.forEach(({ x, y, w, h }) => {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < GRID_COLS && ny >= 0 && ny < GRID_ROWS) {
          if (grid[ny][nx].type === "grass") {
            grid[ny][nx].type = "flower";
            totalGrassCells--;
          }
        }
      }
    }
  });

  for (let x = 0; x < GRID_COLS; x++) {
    const y = 6;
    if (x < 6 || x > 11) {
      if (grid[y][x].type === "grass") {
        grid[y][x].type = "path";
        totalGrassCells--;
      }
    }
  }

  for (let y = 0; y < GRID_ROWS; y++) {
    const x = 10;
    if (y < 3 || y > 8) {
      if (grid[y][x].type === "grass") {
        grid[y][x].type = "path";
        totalGrassCells--;
      }
    }
  }

  const { startX, startY } = findStartPosition(grid);
  return { grid, totalGrassCells, startX, startY };
}

export function createInitialState(customConfig?: CustomGridConfig): GameState {
  const config = customConfig ?? createInitialGrid();
  const { grid, totalGrassCells, startX, startY } = config;
  const mower: Mower = {
    x: startX,
    y: startY,
    direction: "right",
  };

  const path: PathPoint[] = [{ x: startX, y: startY, direction: "right" }];

  const initialGrid = grid.map((row) => row.map((cell) => ({ ...cell })));
  if (initialGrid[startY][startX].type === "grass") {
    initialGrid[startY][startX].type = "mowed";
    initialGrid[startY][startX].grassHeight = 0;
    initialGrid[startY][startX].mowedRow = startY;
    initialGrid[startY][startX].mowedCol = startX;
  }

  const mowedCells = initialGrid[startY][startX].type === "mowed" ? 1 : 0;

  return {
    grid: initialGrid,
    mower,
    startTime: Date.now(),
    elapsedTime: 0,
    completed: false,
    totalGrassCells,
    mowedCells,
    path,
  };
}

export function canMoveTo(grid: Cell[][], x: number, y: number): boolean {
  if (x < 0 || x >= GRID_COLS || y < 0 || y >= GRID_ROWS) return false;
  const cell = grid[y][x];
  return cell.type !== "flower" && cell.type !== "path";
}

export function getDirectionDelta(direction: Direction): {
  dx: number;
  dy: number;
} {
  switch (direction) {
    case "up":
      return { dx: 0, dy: -1 };
    case "down":
      return { dx: 0, dy: 1 };
    case "left":
      return { dx: -1, dy: 0 };
    case "right":
      return { dx: 1, dy: 0 };
  }
}

export function calculateNeatness(path: PathPoint[]): number {
  if (path.length < 2) return 100;

  let straightSegments = 0;
  let totalSegments = path.length - 1;

  for (let i = 1; i < path.length; i++) {
    if (path[i].direction === path[i - 1].direction) {
      straightSegments++;
    }
  }

  return Math.round((straightSegments / totalSegments) * 100);
}

export function calculatePathOverlap(path: PathPoint[]): number {
  if (path.length <= 1) return 0;
  const visited = new Set<string>();
  let overlaps = 0;
  for (const point of path) {
    const key = `${point.x},${point.y}`;
    if (visited.has(key)) {
      overlaps++;
    }
    visited.add(key);
  }
  return Math.round((overlaps / (path.length - 1)) * 100);
}

export function calculateEfficiency(state: GameState): number {
  const totalMoves = state.path.length - 1;
  const necessaryMoves = state.totalGrassCells - 1;
  if (totalMoves <= 0) return 100;
  const efficiency = (necessaryMoves / totalMoves) * 100;
  return Math.min(100, Math.round(efficiency));
}

const ALL_ACHIEVEMENTS: Omit<Achievement, "unlocked">[] = [
  {
    id: "speed_demon",
    name: "疾风割草手",
    description: "30秒内完成修剪",
    icon: "⚡",
  },
  {
    id: "perfectionist",
    name: "完美主义者",
    description: "完成度达到100%",
    icon: "✨",
  },
  {
    id: "precision",
    name: "精准大师",
    description: "整齐度达到95%以上",
    icon: "🎯",
  },
  {
    id: "efficient",
    name: "效率达人",
    description: "效率评分超过90%",
    icon: "💪",
  },
  {
    id: "no_overlap",
    name: "一步到位",
    description: "路径重叠率低于5%",
    icon: "🚀",
  },
  {
    id: "slow_steady",
    name: "稳扎稳打",
    description: "用时超过2分钟但整齐度90%+",
    icon: "🐢",
  },
  { id: "s_rank", name: "S级园丁", description: "获得S级评价", icon: "👑" },
  {
    id: "stubborn",
    name: "倔强蜗牛",
    description: "路径重叠率超过40%",
    icon: "🐌",
  },
];

export function calculateAchievements(
  time: number,
  completion: number,
  neatness: number,
  efficiency: number,
  pathOverlap: number,
  total: number,
): Achievement[] {
  return ALL_ACHIEVEMENTS.map((a) => ({
    ...a,
    unlocked:
      (a.id === "speed_demon" && time <= 30) ||
      (a.id === "perfectionist" && completion === 100) ||
      (a.id === "precision" && neatness >= 95) ||
      (a.id === "efficient" && efficiency >= 90) ||
      (a.id === "no_overlap" && pathOverlap <= 5) ||
      (a.id === "slow_steady" && time >= 120 && neatness >= 90) ||
      (a.id === "s_rank" && total >= 90) ||
      (a.id === "stubborn" && pathOverlap >= 40),
  }));
}

export function determineTitle(
  total: number,
  efficiency: number,
  neatness: number,
  pathOverlap: number,
  time: number,
): string {
  if (total >= 95 && pathOverlap <= 3) return "传说中的园艺大师";
  if (total >= 90 && efficiency >= 95) return "极限效率王";
  if (neatness >= 98 && pathOverlap <= 5) return "艺术级修剪师";
  if (total >= 90) return "金牌园丁";
  if (total >= 80 && efficiency >= 85) return "资深园艺师";
  if (total >= 80) return "优秀割草手";
  if (total >= 70 && time <= 60) return "快手园丁";
  if (total >= 70) return "熟练园丁";
  if (total >= 60) return "入门园丁";
  if (pathOverlap >= 50) return "迷路的割草机";
  return "新手园丁";
}

export function calculateScore(state: GameState): ScoreResult {
  const completion = Math.round(
    (state.mowedCells / state.totalGrassCells) * 100,
  );
  const neatness = calculateNeatness(state.path);
  const pathOverlap = calculatePathOverlap(state.path);
  const efficiency = calculateEfficiency(state);
  const time = Math.round(state.elapsedTime / 1000);

  const timeScore = Math.max(0, 100 - Math.floor(time / 3));
  const nonOverlap = 100 - pathOverlap;
  const total = Math.round(
    completion * 0.25 +
      neatness * 0.2 +
      efficiency * 0.2 +
      nonOverlap * 0.2 +
      timeScore * 0.15,
  );

  let grade = "D";
  if (total >= 90) grade = "S";
  else if (total >= 80) grade = "A";
  else if (total >= 70) grade = "B";
  else if (total >= 60) grade = "C";

  const title = determineTitle(total, efficiency, neatness, pathOverlap, time);
  const achievements = calculateAchievements(
    time,
    completion,
    neatness,
    efficiency,
    pathOverlap,
    total,
  );

  return {
    time,
    completion,
    neatness,
    efficiency,
    pathOverlap,
    total,
    grade,
    title,
    achievements,
  };
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
