import { Component } from '@angular/core';
import { GameComponent } from './game/game.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: ` <router-outlet/>`,
})
export class AppComponent {

}
