// =============================
// 📁 /src/app/game/store/game.store.ts
// (protótipo simples com Signals – apenas para integrar Board)
// =============================
import { Injectable, computed, signal } from '@angular/core';

import { resolveAll } from '../merge-score';
import { Axial, Cell, Color, GameState, makeCellId } from '../type';
import { axialNeighbors } from '../hex-utils';
import { UnionFind } from '../union-find';

@Injectable({ providedIn: 'root' })
export class GameStore {
  private colors: Color[] = ['red','blue','green','yellow','purple','orange'];
  state = signal<GameState>({ grid: {}, score: 0, moves: 0, phase: 'idle' });

  score = computed(() => this.state().score);
  grid = computed(() => this.state().grid);

  /** Exibe para o usuário quantas peças iguais estão conectadas a cada célula colorida */
  groupSizes = computed(() => {
    const grid = this.state().grid;
    const uf = new UnionFind<string>();
    const colored: Cell[] = [];

    for (const c of Object.values(grid)) {
      if (c.stackColor && c.stackCount > 0 && !c.blocked) {
        uf.makeSet(c.id);
        colored.push(c);
      }
    }

    for (const c of colored) {
      for (const n of axialNeighbors(c.coord)) {
        const nid = makeCellId(n);
        const nc = grid[nid];
        if (nc && nc.stackColor === c.stackColor && nc.stackCount > 0 && !nc.blocked) {
          uf.union(c.id, nid);
        }
      }
    }

    const rootSizes: Record<string, number> = {};
    for (const c of colored) {
      const r = uf.find(c.id);
      rootSizes[r] = (rootSizes[r] ?? 0) + 1;
    }

    const sizeById: Record<string, number> = {};
    for (const c of colored) {
      const r = uf.find(c.id);
      sizeById[c.id] = rootSizes[r];
    }
    return sizeById;
  });

  init(radius = 3) {
    const grid: Record<string, Cell> = {};
    for (let q = -radius; q <= radius; q++) {
      for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
        const id = `${q},${r}`;
        grid[id] = { id, coord: { q, r }, stackCount: 0 };
      }
    }
    this.state.set({ grid, score: 0, moves: 0, phase: 'idle' });
  }

  placeAt(a: Axial, color?: Color, count = 1) {
    this.state.update(s => {
      const id = makeCellId(a);
      const cell = s.grid[id];
      if (!cell || cell.blocked || cell.stackColor) return s; // inválido/ocupado

      const pieceColor = color ?? this.getRandomColor();
      const newCell: Cell = { ...cell, stackColor: pieceColor, stackCount: count };
      const newGrid = { ...s.grid, [id]: newCell };

      // Regras de pontuação e cascata (NÃO alteramos counts das outras células)
      const next = resolveAll({ ...s, grid: newGrid, moves: s.moves + 1, phase: 'resolving' }, this.colors);

      const hasSpace = Object.values(next.grid).some(c => !c.stackColor && !c.blocked);
      const phase = hasSpace ? 'idle' : 'gameover';
      return { ...next, phase, grid: { ...next.grid } };
    });
  }

  resetGame(radius = 3) {
    const grid: Record<string, Cell> = {};
    for (let q = -radius; q <= radius; q++) {
      for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
        const id = `${q},${r}`;
        grid[id] = { id, coord: { q, r }, stackCount: 0 };
      }
    }
    this.state.set({ grid, score: 0, moves: 0, phase: 'idle' });
  }

  private getRandomColor(): Color {
    const idx = Math.floor(Math.random() * this.colors.length);
    return this.colors[idx];
  }
}
