import {Component} from '@angular/core';
import {PokemonClient} from 'pokenode-ts';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {Pokemon} from '../Interfaces/pokemon'
import { Modal } from 'bootstrap';
import {typeColors} from '../Mappings/typeColors';


@Component({
  selector: 'app-pokemon-list',
  imports: [
    NgForOf,
    NgStyle,
    NgIf,
    NgClass
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
    const result = await api.listPokemons(0, 100);
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
          height: result.height,
          weight: result.weight,
          stats: [
            {
              base_stat: result.stats[0].base_stat,
              stat: {
                name: result.stats[0].stat.name
              }
            },
            {
              base_stat: result.stats[1].base_stat,
              stat: {
                name: result.stats[1].stat.name
              }
            },
            {
              base_stat: result.stats[2].base_stat,
              stat: {
                name: result.stats[2].stat.name
              }
            },
            {
              base_stat: result.stats[3].base_stat,
              stat: {
                name: result.stats[3].stat.name
              }
            },
            {
              base_stat: result.stats[4].base_stat,
              stat: {
                name: result.stats[4].stat.name
              }
            },
            {
              base_stat: result.stats[5].base_stat,
              stat: {
                name: result.stats[5].stat.name
              }
            }
          ]
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
    // Prüfen, ob der Typ im typeColors existiert
    return typeColors.hasOwnProperty(type.toLowerCase());
  }

  getCardBackgroundColor(types: string[]): string {
    const primaryType = types[0].toLowerCase();

    // Wenn Typ gültig, verwende ihn. Andernfalls Standardfarbe.
    if (this.isValidPokemonType(primaryType)) {
      return typeColors[primaryType];
    } else {
      return '#ffffff';
    }
  }

}
