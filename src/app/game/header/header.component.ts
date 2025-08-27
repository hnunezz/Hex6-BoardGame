import { Component, inject, input, output } from '@angular/core';
import { GameStore } from '../store/game-store';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  store = inject(GameStore);

  fillColor = input();

  resetGameChange = output({ alias: 'resetGame' })

}
