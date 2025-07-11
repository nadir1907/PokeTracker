import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PokemonListComponent} from './pokemon-list/pokemon-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PokemonListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true
})
export class AppComponent {
  title = 'PokeTracker';
}
