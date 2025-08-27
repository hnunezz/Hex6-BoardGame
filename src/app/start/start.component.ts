import { Component, inject, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  imports: [FormsModule],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {
  private router = inject(Router);

  difficulty: number = 0;

  get difficultyLabel(): string {
    return ['Fácil', 'Médio', 'Difícil'][this.difficulty] || '';
  }

  updateDifficulty(value: number) {
    this.difficulty = value;
  }

  startGame() {
    this.router.navigate(["/game"]);
  }
}
