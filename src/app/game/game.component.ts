import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { BoardComponent } from './board/board.component';
import { GameStore } from './store/game-store';
import { colorToFill } from './hex-utils';
import { Axial, Color, makeCellId } from './type';

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
export class GameComponent implements OnInit {
  store = inject(GameStore);
  pendingColor = signal('red');

  fillColor = computed(() => {
    return colorToFill(this.pendingColor())
  })

  ngOnInit() {
    this.store.init(3);
    this.nextRandomPiece();
  }

  nextRandomPiece() {
    const colors: string[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
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
    this.store.resetGame(3);
    this.nextRandomPiece();
  }
}
