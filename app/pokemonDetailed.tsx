import { PokemonType } from "./pokemonType";

export interface PokemonDetailed {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[]; 
}