import { ThemedView } from "@/components/themed-view"; import { AppContext } from "@/context/AppContext"; import { API_URL } from "@/constants/Util";

import { useContext, useEffect, useRef, useState } from "react";

import { ActivityIndicator, Alert, Button, StyleSheet, Text, ToastAndroid, Platform, } from "react-native";

import MapView, { Marker, Polyline, Region, } from "react-native-maps";

import * as Location from "expo-location";
import { useRouter } from "expo-router";

// -------------------------------------------------- // CONSTANTS // --------------------------------------------------

const DEFAULT_LOCATION = { latitude: -23.5505, longitude: -46.6333, };

// -------------------------------------------------- // TYPES // --------------------------------------------------

type HealthPoint = { id: number; name: string; latitude: number; longitude: number; };

type NearestHealthPointResponse = {
  healthPoint: HealthPoint;

  route: {
    distance: number; duration: number;

    // OSRM returns [longitude, latitude]
    coordinates: [number, number][];

  };
};

// -------------------------------------------------- // COMPONENT // --------------------------------------------------

export default function Home() {
  const context = useContext(AppContext);
  const router = useRouter();

  const mapRef = useRef<MapView>(null);

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [healthPoint, setHealthPoint] = useState<HealthPoint | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number; longitude: number }[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // -------------------------------------------------- // USER LOCATION // --------------------------------------------------

  useEffect(() => {
    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permissão necessária",
            "Não foi possível obter sua localização. Mostrando localização padrão."
          );

          return;
        }

        const currentLocation =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        setLocation(currentLocation);

      } catch (error) {
        console.error("Erro ao obter localização:", error);

        Alert.alert(
          "Erro",
          "Não foi possível obter sua localização."
        );

      } finally {
        setLoadingLocation(false);
      }
    }

    getLocation();

  }, []);

  // -------------------------------------------------- // COORDINATES // --------------------------------------------------

  const latitude = location?.coords.latitude ?? DEFAULT_LOCATION.latitude;
  const longitude = location?.coords.longitude ?? DEFAULT_LOCATION.longitude;

  // -------------------------------------------------- // FIND NEAREST HEALTH POINT // --------------------------------------------------

  const findNearestHealthPoint = async () => {
    try {
      setLoadingRoute(true);

      setHealthPoint(null);
      setRouteCoordinates([]);
      setDistance(null);
      setDuration(null);

      const response = await fetch(
        `${API_URL}/health-points/nearest?latitude=${latitude}&longitude=${longitude}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${context.token}`,
          },
        }
      );

      if (!response.ok) {
        Alert.alert(
          "Erro",
          "Não foi possível encontrar um ponto de saúde."
        );

        return;
      }

      const data: NearestHealthPointResponse =
        await response.json();

      // Save health point
      setHealthPoint(data.healthPoint);

      // Save distance and duration
      setDistance(data.route.distance);
      setDuration(data.route.duration);

      // Convert OSRM coordinates:
      // [longitude, latitude]
      //
      // To react-native-maps:
      // { latitude, longitude }

      const coordinates = data.route.coordinates.map(
        ([longitude, latitude]) => ({
          latitude,
          longitude,
        })
      );

      setRouteCoordinates(coordinates);

      // Adjust map to display entire route
      if (coordinates.length > 0) {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: {
            top: 120,
            right: 60,
            bottom: 120,
            left: 60,
          },
          animated: true,
        });
      }

      Alert.alert(
        "Ponto de saúde encontrado!",
        `Destino: ${data.healthPoint.name}\n\n` +
        `Distância: ${(data.route.distance / 1000).toFixed(2)} km\n` +
        `Tempo estimado: ${Math.ceil(data.route.duration / 60)} minutos`
      );

    } catch (error) {
      console.error("Erro ao buscar rota:", error);

      Alert.alert(
        "Erro",
        "Não foi possível calcular a rota."
      );

    } finally {
      setLoadingRoute(false);
    }

  };

  // -------------------------------------------------- // EMERGENCY // --------------------------------------------------

  const sendEmergency = async () => {
    try {
      const response = await fetch(`${API_URL}/emergencias`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.token}`,
        },

        body: JSON.stringify({
          latitude,
          longitude,
        }),
      }
      );

      if (!response.ok) {
        ToastAndroid.show(
          "Erro desconhecido",
          ToastAndroid.SHORT
        );

        return;
      }

      Alert.alert(
        "Emergência",
        "Emergência disparada. Logo a ajuda chegará."
      );

    } catch (error) {
      console.error("Erro ao disparar emergência:", error);

      Alert.alert(
        "Erro",
        "Não foi possível disparar a emergência."
      );
    }

  };

  // -------------------------------------------------- // HEALTH UNIT // --------------------------------------------------

  const findHealthUnit = async () => {
    try {
      const response = await fetch(`${API_URL}/health-unit/nearest?latitude=${latitude}&longitude=${longitude}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.token}`
        }
      });

      if (!response.ok) {
        ToastAndroid.show('Erro desconhecido. Contate o suporte técnico', 3000);
        return;
      }

      const data = await response.json();

      ToastAndroid.show('Exibindo rotas', 3000);
    } catch (error) {
      ToastAndroid.show('Erro ao buscar unidades', 3000);
    }
  }

  // -------------------------------------------------- // RENDER // --------------------------------------------------

  return (<ThemedView style={styles.container}>

    {/* FIND HEALTH POINT BUTTON */}

    <Button
      title={
        loadingRoute
          ? "Calculando rota..."
          : "Encontrar ponto de saúde"
      }
      onPress={findNearestHealthPoint}
      disabled={loadingRoute || loadingLocation}
    />

    {/* LOADING LOCATION */}

    {loadingLocation && (
      <ActivityIndicator
        size="large"
        color="#2563eb"
        style={styles.loading}
      />
    )}

    {/* MAP */}

    <MapView
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >

      {/* USER MARKER */}

      <Marker
        coordinate={{
          latitude,
          longitude,
        }}
        title="Você"
        description="Sua localização atual"
        pinColor="blue"
      />

      {/* HEALTH POINT MARKER */}

      {healthPoint && (
        <Marker
          coordinate={{
            latitude: healthPoint.latitude,
            longitude: healthPoint.longitude,
          }}
          title={healthPoint.name}
          description="Ponto de saúde mais próximo"
          pinColor="red"
        />
      )}

      {/* ROUTE */}

      {routeCoordinates.length > 0 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#2563eb"
          strokeWidth={5}
        />
      )}

    </MapView>

    {/* ROUTE INFORMATION */}

    {healthPoint && (
      <ThemedView style={styles.infoContainer}>

        <Text style={styles.title}>
          {healthPoint.name}
        </Text>

        <Text style={styles.info}>
          Distância: {((distance ?? 0) / 1000).toFixed(2)} km
        </Text>

        <Text style={styles.info}>
          Tempo estimado: {Math.ceil((duration ?? 0) / 60)} minutos
        </Text>

      </ThemedView>
    )}

    {/* LOADING ROUTE */}

    {loadingRoute && (
      <ActivityIndicator
        size="large"
        color="#2563eb"
        style={styles.loading}
      />
    )}

    {/* FIND HEALTH UNIT BUTTON */}
    <Button 
      title="Achar Unidade"
      color="#0004ff"
      onPress={findHealthUnit}
    />

    {/* EMERGENCY BUTTON */}

    <Button
      title="Emergência"
      color="#ec1b1b"
      onPress={sendEmergency}
    />

    {/* EMERGENCY BUTTON */}

    <Button
      title="Sair"
      color="#ffffff"
      onPress={() => {
        router.replace("/screens/initial");
        context.setToken('null');
      }}
    />
  </ThemedView>

  );
}

// -------------------------------------------------- // STYLES // --------------------------------------------------

const styles = StyleSheet.create({

  container: { flex: 1, },

  map: { flex: 1, width: "100%", },

  loading: { margin: 10, },

  infoContainer: { padding: 15, backgroundColor: "#ffffff", },

  title: { fontSize: 18, fontWeight: "bold", color: "#222222", },

  info: { fontSize: 14, color: "#555555", marginTop: 5, },

});