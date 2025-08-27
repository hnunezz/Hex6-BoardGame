export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface Axial { q: number; r: number }
export interface Cube { x: number; y: number; z: number }

export interface Cell {
  id: string;            // `${q},${r}`
  coord: Axial;
  stackColor?: Color;    // undefined => vazia
  stackCount: number;    // 0..10
  blocked?: boolean;
}

export interface Piece { color: Color; count: number }

export interface GameState {
  grid: Record<string, Cell>;
  score: number;
  moves: number;
  phase: 'idle'|'dragging'|'placing'|'resolving'|'gameover';
}

export const makeCellId = (a: Axial) => `${a.q},${a.r}`;
