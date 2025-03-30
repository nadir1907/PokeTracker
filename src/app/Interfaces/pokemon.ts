export interface Pokemon {
  name: string;
  sprite: string | null;
  order: number;
  types: string[];
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    stat: { name: string }
  }[];
}
