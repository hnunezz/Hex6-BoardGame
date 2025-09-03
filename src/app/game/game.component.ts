import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { BoardComponent } from './board/board.component';
import { GameStore } from './store/game-store';
import { colorToFill } from './hex-utils';
import { Axial, Color, makeCellId } from './type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  imports: [HeaderComponent, BoardComponent],
  template: `
    <div style=" height:100vh; position: relative;">
      <app-header
        [fillColor]="fillColor()"
        (resetGame)="resetGame()"
      />
      <app-board
        [phase]="store.state().phase"
        [grid]="store.grid()"
        [groupSizes]="store.groupSizes()"
        [hexSize]="32"
        (cellSelected)="onPick($event)"
      />
    </div>
  `,
})
export class GameComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  store = inject(GameStore);

  private difficulty = '';
  pendingColor = signal('red');

  fillColor = computed(() => {
    return colorToFill(this.pendingColor())
  })

  ngOnInit() {
    if (localStorage.getItem("GAME-DIFF") === null) {
      this.router.navigate(["/"]);
      return;
    }

    this.difficulty = localStorage.getItem("GAME-DIFF") as string;

    this.store.init(3);
    this.nextRandomPiece();
  }

  ngOnDestroy(): void {
    localStorage.clear();
  }

  nextRandomPiece() {
    let colors: string[] = []
    switch (this.difficulty) {
      case "0":
        colors = ['red', 'blue', 'green', 'yellow']
        break;
      case "1":
        colors = ['red', 'blue', 'green', 'yellow', 'purple']
        break;
      case "2":
        colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
        break;
    }

    this.pendingColor.set(colors[Math.floor(Math.random() * colors.length)]);
  }

  onPick(axial: Axial) {
    if (this.store.state().phase === 'gameover') return;
    const id = makeCellId(axial);
    const cell = this.store.state().grid[id];
    if (!cell || cell.stackColor) return;
    this.store.placeAt(axial, this.pendingColor() as Color, 1);
    if (this.store.state().phase !== 'gameover') {
      this.nextRandomPiece();
    }
  }

  resetGame() {
    if (localStorage.getItem("GAME-DIFF") === null) {
      this.router.navigate(["/"]);
      return;
    }

    this.store.resetGame(3);
    this.nextRandomPiece();
  }
}
