import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Pokemon } from "./pokemon";
import { PokemonDetailed } from "./pokemonDetailed";

export default function Index() {
  const [pokemons, setPokemons] = useState<PokemonDetailed[]>([]);

  useEffect(() => {
    // fetch pokemon data from pokeapi.co
    fetchPokemns();
  }, []);

  async function fetchPokemns() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=100"
      );
      const data = await response.json();
      // fetched detailed pokemon data in parallel.
      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: Pokemon) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        })
      );

      setPokemons(detailedPokemons);
      console.log(JSON.stringify(detailedPokemons[0], null, 2));
    } catch (error) {
      console.error("Error fetching Pokemon data:", error);
    }
  }

  const colorsByType: { [key: string]: string } = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  const getTypeColor = (typeName: string): string => {
    return colorsByType[typeName] || "#A8A77A"; // Default to normal type color
  };

  return (
    <ScrollView
      contentContainerStyle={{ gap: 16,  padding:16 }}
    >
      {pokemons.map((pokemon: PokemonDetailed) => (
        <View
          key={pokemon.name}
          style={{
            backgroundColor: getTypeColor(pokemon.types[0].type.name) + 48,
            padding: 20,
            borderRadius: 30,
          }}
        >
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.types}>{pokemon.types[0].type.name}</Text>
          <View style={{ flexDirection: "row" }}>
            <Image
              source={{ uri: pokemon.image }}
              style={{ width: 200, height: 200 }}
            />
            <Image
              source={{ uri: pokemon.imageBack }}
              style={{ width: 200, height: 200 }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  types: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
});
