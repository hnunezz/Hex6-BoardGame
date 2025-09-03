import { Component, inject, input, OnInit, output } from '@angular/core';
import { GameStore } from '../store/game-store';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private difficulty?: number
  get difficultyLabel(): string {
    return ['Fácil', 'Médio', 'Difícil'][this.difficulty as number] || '';
  }

  store = inject(GameStore);

  fillColor = input();

  resetGameChange = output({ alias: 'resetGame' })

  ngOnInit(): void {
    this.difficulty = parseInt(localStorage.getItem("GAME-DIFF") as string);
  }

  changeDiff() {
    localStorage.clear();
    this.resetGameChange.emit()
  }
}
