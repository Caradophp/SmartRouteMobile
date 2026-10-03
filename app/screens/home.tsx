import { ThemedView } from "@/components/themed-view";
import { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function Home() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    useEffect(() => {
        async function getLocation() {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                Alert.alert(
                "Permissão necessária",
                "Precisamos da sua localização para encontrar postos próximos."
                );
                return;
            }

            const currentLocation = await Location.getCurrentPositionAsync({});

            setLocation(currentLocation);
        }

        getLocation();
  }, []);

  if (!location) {
    Alert.alert("Erro ao obter localização")
    return null;
  }

  const { latitude, longitude } = location.coords;

  return (
    <ThemedView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.5505,
          longitude: -46.6333,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude,
            longitude
          }}
          title="Você"
        />
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: "100%",
    height: "100%",
  },
});
