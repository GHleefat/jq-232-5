export type CellType = 'grass' | 'flower' | 'path' | 'mowed';

export type Direction = 'up' | 'down' | 'left' | 'right';

export type EditorTool = 'grass' | 'flower' | 'path' | 'eraser';

export interface Cell {
  type: CellType;
  grassHeight: number;
  mowedRow: number | null;
  mowedCol: number | null;
}

export interface Mower {
  x: number;
  y: number;
  direction: Direction;
}

export interface PathPoint {
  x: number;
  y: number;
  direction: Direction;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface ScoreResult {
  time: number;
  completion: number;
  neatness: number;
  efficiency: number;
  pathOverlap: number;
  total: number;
  grade: string;
  title: string;
  achievements: Achievement[];
}

export interface GameState {
  grid: Cell[][];
  mower: Mower;
  startTime: number;
  elapsedTime: number;
  completed: boolean;
  totalGrassCells: number;
  mowedCells: number;
  path: PathPoint[];
}

export interface CustomGridConfig {
  grid: Cell[][];
  totalGrassCells: number;
  startX: number;
  startY: number;
}
