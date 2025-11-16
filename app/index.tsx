import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Pokemon } from "./pokemon";

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]); 

  useEffect( () => {
    // fetch pokemon data from pokeapi.co
    fetchPokemns();
  }, []);  

  async function fetchPokemns(){
    try{
      const response =  await fetch("https://pokeapi.co/api/v2/pokemon?limit=20"); 
      const data = await response.json();
      
      setPokemons(data.results); 
      console.log(pokemons);
    }
    catch(error){
      console.error("Error fetching Pokemon data:", error);
    }
  }

  return (
    <ScrollView>
      { pokemons.map( (pokemon) => (
        <View key={pokemon.name}>
          <Text>{pokemon.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
