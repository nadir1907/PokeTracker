import {Component} from '@angular/core';
import {PokemonClient} from 'pokenode-ts';
import {NgForOf, NgStyle} from '@angular/common';
import {Pokemon} from '../Interfaces/pokemon'
import { Modal } from 'bootstrap';
import {typeColors} from '../Mappings/typeColors';


@Component({
  selector: 'app-pokemon-list',
  imports: [
    NgForOf,
    NgStyle
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
    const result = await api.listPokemons(0, 2500);
    this.pokemonsNamesList = result.results.map((value) => value.name);

    // 2. Lade alle Pokémon-Details parallel
    this.sortedPokemons = await Promise.all(
      this.pokemonsNamesList.map(async (name) => {
        const result = await api.getPokemonByName(name);
        console.log(result);
        return {
          name: result.name,
          sprite: result.sprites.front_default,
          order: result.order,
          types: result.types.map((type) => type.type.name),
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

  isValidPokemonType(type: string): boolean {
    // Wir prüfen, ob der Typ im typeColors-Objekt existiert
    return typeColors.hasOwnProperty(type.toLowerCase());
  }

  getCardBackgroundColor(types: string[]): string {
    const primaryType = types[0].toLowerCase(); // Wir nehmen den ersten Typ (konvertiert zu Kleinbuchstaben)

    // Wenn der Typ gültig ist, verwenden wir ihn. Andernfalls geben wir eine Standardfarbe zurück.
    if (this.isValidPokemonType(primaryType)) {
      return typeColors[primaryType]; // Hier wird sicher auf typeColors zugegriffen
    } else {
      return '#ffffff'; // Rückfallfarbe
    }
  }

}
