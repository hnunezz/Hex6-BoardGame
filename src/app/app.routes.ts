import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { StartComponent } from './start/start.component';

export const routes: Routes = [
  {
    path: "",
    component: StartComponent,
  },
  {
    path: "game",
    component: GameComponent,
  }
];
