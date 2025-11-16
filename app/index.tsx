import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Pokemon } from "./pokemon";
import { PokemonDetailed } from "./pokemonDetailed";

export default function Index() {
  const [pokemons, setPokemons] = useState<PokemonDetailed[]>([]); 

  useEffect( () => {
    // fetch pokemon data from pokeapi.co
    fetchPokemns();
  }, []);  

  async function fetchPokemns(){
    try{
      const response =  await fetch("https://pokeapi.co/api/v2/pokemon?limit=20"); 
      const data = await response.json();
      // fetched detailed pokemon data in parallel.
      const detailedPokemons = await Promise.all(
        data.results.map( async (pokemon: Pokemon) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name : pokemon.name,
            image : details.sprites.front_default,
            imageBack : details.sprites.back_default
          }
        })  
      );


      setPokemons(detailedPokemons); 
      console.log(pokemons);
    }
    catch(error){
      console.error("Error fetching Pokemon data:", error);
    }
  }

  return (
    <ScrollView>
      { pokemons.map( (pokemon: PokemonDetailed) => (
        <View key={pokemon.name}>
          <Text>{pokemon.name}</Text>
          <View style = {{flexDirection : 'row'}}>
            <Image 
            source = {{uri: pokemon.image}}
            style = {{width: 200, height : 200}} />
          <Image 
            source = {{uri: pokemon.imageBack}}
            style = {{width: 200, height : 200}} />
          </View>
          
        </View>
      ))}
    </ScrollView>
  );
}
