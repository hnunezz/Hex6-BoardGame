import { NgClass } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  imports: [FormsModule, NgClass],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent implements OnInit {
  private router = inject(Router);

  difficulty: number = 0;
  difficulties = [
    { label: 'Fácil', value: 0 },
    { label: 'Médio', value: 1 },
    { label: 'Difícil', value: 2 },
  ];

  ngOnInit(): void {
    localStorage.setItem("GAME-DIFF", '0');
  }

  updateDifficulty(value: number) {
    this.difficulty = value;
    localStorage.setItem("GAME-DIFF", this.difficulty.toString());
  }

  startGame() {
    this.router.navigate(["/game"]);
  }
}
