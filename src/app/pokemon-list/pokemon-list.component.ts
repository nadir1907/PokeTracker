import {Component} from '@angular/core';
import {PokemonClient} from 'pokenode-ts';
import {NgForOf} from '@angular/common';
import {Pokemon} from '../Interfaces/pokemon'
import { Modal } from 'bootstrap';


@Component({
  selector: 'app-pokemon-list',
  imports: [
    NgForOf
  ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})

export class PokemonListComponent {
  private pokemonsNamesList: string[] = [];
  private modalInstance!: Modal;
  protected sortedPokemons: Pokemon[] = [];
  selectedPokemon: Pokemon | null = null;

  async ngOnInit() {
    const api = new PokemonClient();

    // 1. Hol die ersten 30 Pokémon-Namen
    const result = await api.listPokemons(0, 60);
    this.pokemonsNamesList = result.results.map((value) => value.name);

    // 2. Lade alle Pokémon-Details parallel
    this.sortedPokemons = await Promise.all(
      this.pokemonsNamesList.map(async (name) => {
        const result = await api.getPokemonByName(name);
        return {
          name: result.name,
          sprite: result.sprites.front_default,
          order: result.order,
        };
      })
    );
  }

  openModal(pokemon: Pokemon) {
    this.selectedPokemon = pokemon;
    if (!this.modalInstance) {
      this.modalInstance = new Modal(document.getElementById('pokemonModal')!);
    }
    this.modalInstance.show();
  }
}
