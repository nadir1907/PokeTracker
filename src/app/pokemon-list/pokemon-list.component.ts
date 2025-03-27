import {Component} from '@angular/core';
import {PokemonClient} from 'pokenode-ts';
import {NgForOf} from '@angular/common';
import {Pokemon} from '../Interfaces/pokemon'


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
  protected pokemonList: Pokemon[] = [];

  ngOnInit() {
    (async () => {
      const api = new PokemonClient();

      await api.listPokemons(0, 30).then((result) => {
        result.results.forEach(value => {
          this.pokemonsNamesList.push(value.name);
        })
      });

      this.pokemonsNamesList.forEach((value) => {
        api.getPokemonByName(value).then((result) => {
          console.log(value);
          this.pokemonList.push({
            name: result.name,
            sprite: result.sprites.front_default,
            order: result.order,
          });
        });
      });
      this.pokemonList.sort((a, b) => a.order - b.order);
    })();
  }
}
