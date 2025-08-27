import { axialNeighbors } from './hex-utils';
import { Cell, Color, GameState, makeCellId } from './type';
import { UnionFind } from './union-find';

export interface ResolveResult { state: GameState; changed: boolean; scoreDelta: number }

export function resolveForColor(state: GameState, color: Color): ResolveResult {
  const uf = new UnionFind<string>();
  const colored: Cell[] = [];
  for (const c of Object.values(state.grid)) {
    if (c.stackColor === color && c.stackCount > 0) {
      uf.makeSet(c.id);
      colored.push(c);
    }
  }
  for (const c of colored) {
    for (const n of axialNeighbors(c.coord)) {
      const nid = makeCellId(n);
      const nc = state.grid[nid];
      if (nc && nc.stackColor === color && nc.stackCount > 0) uf.union(c.id, nc.id);
    }
  }
  const groups: Record<string, Cell[]> = {};
  for (const c of colored) {
    const r = uf.find(c.id);
    (groups[r] ||= []).push(c);
  }

  let scoreDelta = 0;
  let changed = false;
  const newGrid = { ...state.grid };

  for (const g of Object.values(groups)) {
    const sum = g.reduce((s, c) => s + c.stackCount, 0);
    if (sum >= 10) {
      scoreDelta += Math.floor(sum / 10); // 1 ponto por cada 10 unidades
      changed = true;
      for (const c of g) newGrid[c.id] = { ...c, stackColor: undefined, stackCount: 0 };
    }
  }

  return { state: { ...state, grid: newGrid, score: state.score + scoreDelta }, changed, scoreDelta };
}

export function resolveAll(state: GameState, colors: Color[]): GameState {
  let cur = state; let changed = true;
  while (changed) {
    changed = false;
    for (const color of colors) {
      const { state: next, changed: ch } = resolveForColor(cur, color);
      cur = next; changed = changed || ch;
    }
  }
  return cur;
}
