import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface PokemonDetails {
  name: string;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
  stats: Array<{ stat: { name: string }; base_stat: number }>;
  sprites: { front_default: string };
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  image: { width: 200, height: 200, alignSelf: "center", marginBottom: 16 },
  section: { marginBottom: 16, backgroundColor: "white", padding: 12, borderRadius: 8 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8, color: "#333" },
  text: { fontSize: 14, marginBottom: 6, color: "#555" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  badge: { backgroundColor: "#007AFF", color: "white", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginRight: 8, marginBottom: 6, display: "flex" },
});

export default function Details() {
  const params = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemonbyName();
  }, []);

  async function fetchPokemonbyName() {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${params.name}`
      );
      const details = await response.json();
      console.log("Fetched Pokemon Details:", JSON.stringify(details, null, 2));
      setPokemon(details);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokemon data by name:", error);
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: params.name?.toString() || "Details" }} />
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <Text style={styles.title}>Loading...</Text>
        ) : pokemon ? (
          <>
            <Text style={styles.title}>{pokemon.name.toUpperCase()}</Text>

            {pokemon.sprites.front_default && (
              <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
            )}

            {/* Basic Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📏 Basic Info</Text>
              <Text style={styles.text}>Height: {(pokemon.height / 10).toFixed(1)}m</Text>
              <Text style={styles.text}>Weight: {(pokemon.weight / 10).toFixed(1)}kg</Text>
            </View>

            {/* Types */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚡ Types</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {pokemon.types.map((type, idx) => (
                  <View key={idx} style={styles.badge}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>{type.type.name}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Abilities */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎯 Abilities</Text>
              {pokemon.abilities.map((ability, idx) => (
                <Text key={idx} style={styles.text}>
                  • {ability.ability.name} {ability.is_hidden ? "🔒 (Hidden)" : ""}
                </Text>
              ))}
            </View>

            {/* Stats */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 Stats</Text>
              {pokemon.stats.map((stat, idx) => (
                <View key={idx} style={styles.statsRow}>
                  <Text style={styles.text}>{stat.stat.name}:</Text>
                  <Text style={{ fontWeight: "bold", color: "#007AFF" }}>{stat.base_stat}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.title}>Pokemon not found</Text>
        )}
      </ScrollView>
    </>
  );
}
