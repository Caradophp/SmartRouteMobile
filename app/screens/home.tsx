import { ThemedView } from "@/components/themed-view";
import { AppContext } from "@/context/AppContext";
import { API_URL } from "@/constants/Util";

import { useContext, useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Button,
  Linking,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";

import MapView, {
  Marker,
  Polyline,
  Region,
} from "react-native-maps";

import * as Location from "expo-location";

import { useRouter } from "expo-router";

// ==================================================
// CONSTANTS
// ==================================================

const DEFAULT_LOCATION = {
  latitude: -23.5505,
  longitude: -46.6333,
};

// ==================================================
// TYPES
// ==================================================

type HealthUnit = {
  id: string;
  name: string;
  tipo: string;
  latitude: number;
  longitude: number;
};

type RouteData = {
  distance: number;
  duration: number;

  // OSRM returns [longitude, latitude]
  coordinates: [number, number][];
};

type NearestHealthPointResponse = {
  healthUnit: HealthUnit;
  route: RouteData;
};

type MapCoordinate = {
  latitude: number;
  longitude: number;
};

// ==================================================
// COMPONENT
// ==================================================

export default function Home() {

  const context = useContext(AppContext);

  const router = useRouter();

  const mapRef = useRef<MapView>(null);

  // ==================================================
  // STATES
  // ==================================================

  const [location, setLocation] =
    useState<Location.LocationObject | null>(null);

  const [healthUnit, setHealthUnit] =
    useState<HealthUnit | null>(null);

  const [routeCoordinates, setRouteCoordinates] =
    useState<MapCoordinate[]>([]);

  const [distance, setDistance] =
    useState<number | null>(null);

  const [duration, setDuration] =
    useState<number | null>(null);

  const [loadingLocation, setLoadingLocation] =
    useState(true);

  const [loadingRoute, setLoadingRoute] =
    useState(false);

  // ==================================================
  // USER COORDINATES
  // ==================================================

  const latitude =
    location?.coords.latitude ??
    DEFAULT_LOCATION.latitude;

  const longitude =
    location?.coords.longitude ??
    DEFAULT_LOCATION.longitude;

  // ==================================================
  // NOTIFICATIONS
  // ==================================================

  const showMessage = (message: string) => {

    if (Platform.OS === "android") {

      ToastAndroid.show(
        message,
        ToastAndroid.SHORT
      );

    } else {

      Alert.alert(
        "Informação",
        message
      );

    }
  };

  // ==================================================
  // GET USER LOCATION
  // ==================================================

  useEffect(() => {

    async function getLocation() {

      try {

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {

          Alert.alert(
            "Permissão necessária",
            "Não foi possível obter sua localização. Utilizando localização padrão."
          );

          return;
        }

        const currentLocation =
          await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          });

        setLocation(currentLocation);

      } catch (error) {

        console.error(
          "Erro ao obter localização:",
          error
        );

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

  // ==================================================
  // UPDATE MAP WHEN LOCATION IS OBTAINED
  // ==================================================

  useEffect(() => {

    if (!location || healthUnit) {
      return;
    }

    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      },
      800
    );

  }, [location]);

  // ==================================================
  // CLEAR ROUTE
  // ==================================================

  const clearRoute = () => {

    setHealthUnit(null);

    setRouteCoordinates([]);

    setDistance(null);

    setDuration(null);

  };

  // ==================================================
  // FIND NEAREST HEALTH UNIT
  // ==================================================

  const findNearestHealthPoint = async () => {

    try {

      setLoadingRoute(true);

      clearRoute();

      const url =
        `${API_URL}/health-points/nearest` +
        `?latitude=${latitude}` +
        `&longitude=${longitude}`;

      console.log("Requesting nearest health unit:", url);

      const response = await fetch(
        url,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${context.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // ----------------------------------------------
      // HANDLE HTTP ERRORS
      // ----------------------------------------------

      if (!response.ok) {

        const errorMessage = await response.text();

        console.error(
          "Backend error:",
          errorMessage
        );

        Alert.alert(
          "Erro",
          "Não foi possível encontrar uma unidade de saúde."
        );

        return;
      }

      // ----------------------------------------------
      // PARSE RESPONSE
      // ----------------------------------------------

      const data: NearestHealthPointResponse =
        await response.json();

      console.log(
        "Nearest health unit response:",
        data
      );

      // ----------------------------------------------
      // VALIDATE RESPONSE
      // ----------------------------------------------

      if (
        !data.healthUnit ||
        !data.route ||
        !Array.isArray(data.route.coordinates) ||
        data.route.coordinates.length === 0
      ) {

        Alert.alert(
          "Erro",
          "O servidor não retornou uma rota válida."
        );

        return;
      }

      // ----------------------------------------------
      // VALIDATE DESTINATION COORDINATES
      // ----------------------------------------------

      const destination = data.healthUnit;

      if (
        !Number.isFinite(destination.latitude) ||
        !Number.isFinite(destination.longitude) ||
        Math.abs(destination.latitude) > 90 ||
        Math.abs(destination.longitude) > 180
      ) {

        Alert.alert(
          "Erro",
          "As coordenadas da unidade de saúde são inválidas."
        );

        return;
      }

      // ----------------------------------------------
      // CONVERT OSRM COORDINATES
      // ----------------------------------------------

      const coordinates: MapCoordinate[] =
        data.route.coordinates.map(
          ([longitude, latitude]) => ({
            latitude,
            longitude,
          })
        );

      // ----------------------------------------------
      // SAVE HEALTH UNIT
      // ----------------------------------------------

      setHealthUnit(data.healthUnit);

      // ----------------------------------------------
      // SAVE ROUTE INFORMATION
      // ----------------------------------------------

      setDistance(data.route.distance);

      setDuration(data.route.duration);

      setRouteCoordinates(coordinates);

      // ----------------------------------------------
      // FIT MAP TO ENTIRE ROUTE
      // ----------------------------------------------

      const allCoordinates: MapCoordinate[] = [
        {
          latitude,
          longitude,
        },

        {
          latitude: destination.latitude,
          longitude: destination.longitude,
        },

        ...coordinates,
      ];

      setTimeout(() => {

        mapRef.current?.fitToCoordinates(
          allCoordinates,
          {
            edgePadding: {
              top: 100,
              right: 60,
              bottom: 180,
              left: 60,
            },

            animated: true,
          }
        );

      }, 500);

      // ----------------------------------------------
      // SUCCESS MESSAGE
      // ----------------------------------------------

      Alert.alert(
        "Rota encontrada!",
        `Destino: ${destination.name}\n\n` +
        `Tipo: ${destination.tipo}\n` +
        `Distância: ${(data.route.distance / 1000).toFixed(2)} km\n` +
        `Tempo estimado: ${Math.ceil(data.route.duration / 60)} minutos`
      );

    } catch (error) {

      console.error(
        "Erro ao buscar rota:",
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível calcular a rota. Verifique sua conexão."
      );

    } finally {

      setLoadingRoute(false);

    }
  };

  // ==================================================
  // OPEN GOOGLE MAPS
  // ==================================================

  const openGoogleMaps = async () => {

    if (!healthUnit) {
      return;
    }

    const url =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${latitude},${longitude}` +
      `&destination=${healthUnit.latitude},${healthUnit.longitude}` +
      `&travelmode=driving`;

    try {

      await Linking.openURL(url);

    } catch (error) {

      console.error(
        "Erro ao abrir Google Maps:",
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível abrir o Google Maps."
      );

    }
  };

  // ==================================================
  // FIND HEALTH UNIT (EXISTING ENDPOINT)
  // ==================================================

  const findHealthUnit = async () => {

    try {

      const response = await fetch(
        `${API_URL}/health-unit/nearest?latitude=${latitude}&longitude=${longitude}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${context.token}`,
          },
        }
      );

      if (!response.ok) {

        showMessage(
          "Erro ao buscar unidades de saúde."
        );

        return;
      }

      const data = await response.json();

      console.log(
        "Health unit response:",
        data
      );

      showMessage(
        "Unidades de saúde encontradas!"
      );

    } catch (error) {

      console.error(
        "Erro ao buscar unidades:",
        error
      );

      showMessage(
        "Erro ao buscar unidades."
      );

    }
  };

  // ==================================================
  // SEND EMERGENCY
  // ==================================================

  const sendEmergency = async () => {

    try {

      const response = await fetch(
        `${API_URL}/emergencias`,
        {
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

        showMessage(
          "Erro ao enviar emergência."
        );

        return;
      }

      Alert.alert(
        "Emergência",
        "Emergência disparada. Logo a ajuda chegará."
      );

    } catch (error) {

      console.error(
        "Erro ao disparar emergência:",
        error
      );

      Alert.alert(
        "Erro",
        "Não foi possível disparar a emergência."
      );

    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const logout = () => {

    context.setToken("null");

    router.replace("/screens/initial");

  };

  // ==================================================
  // RENDER
  // ==================================================

  return (

    <ThemedView style={styles.container}>

      {/* ========================================= */}
      {/* FIND NEAREST HEALTH UNIT BUTTON */}
      {/* ========================================= */}

      <View style={styles.buttonContainer}>

        <Button
          title={
            loadingRoute
              ? "Calculando rota..."
              : "Encontrar ponto de saúde"
          }

          onPress={findNearestHealthPoint}

          disabled={
            loadingRoute ||
            loadingLocation
          }

          color="#2563eb"
        />

      </View>

      {/* ========================================= */}
      {/* LOCATION LOADING */}
      {/* ========================================= */}

      {loadingLocation && (

        <View style={styles.loadingContainer}>

          <ActivityIndicator
            size="large"
            color="#2563eb"
          />

          <Text style={styles.loadingText}>
            Obtendo sua localização...
          </Text>

        </View>

      )}

      {/* ========================================= */}
      {/* MAP */}
      {/* ========================================= */}

      <MapView
        ref={mapRef}

        style={styles.map}

        initialRegion={{
          latitude: DEFAULT_LOCATION.latitude,
          longitude: DEFAULT_LOCATION.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}

        showsUserLocation={true}

        showsMyLocationButton={true}

        followsUserLocation={false}

        loadingEnabled={true}
      >

        {/* --------------------------------------- */}
        {/* USER LOCATION MARKER */}
        {/* --------------------------------------- */}

        <Marker
          coordinate={{
            latitude,
            longitude,
          }}

          title="Você"

          description="Sua localização atual"

          pinColor="blue"
        />

        {/* --------------------------------------- */}
        {/* HEALTH UNIT MARKER */}
        {/* --------------------------------------- */}

        {healthUnit && (

          <Marker
            coordinate={{
              latitude: healthUnit.latitude,
              longitude: healthUnit.longitude,
            }}

            title={healthUnit.name}

            description={`Tipo: ${healthUnit.tipo}`}

            pinColor="red"
          />

        )}

        {/* --------------------------------------- */}
        {/* OSRM ROUTE */}
        {/* --------------------------------------- */}

        {routeCoordinates.length > 0 && (

          <Polyline
            coordinates={routeCoordinates}

            strokeColor="#2563eb"

            strokeWidth={6}

            lineCap="round"

            lineJoin="round"
          />

        )}

      </MapView>

      {/* ========================================= */}
      {/* ROUTE LOADING */}
      {/* ========================================= */}

      {loadingRoute && (

        <View style={styles.routeLoading}>

          <ActivityIndicator
            size="large"
            color="#2563eb"
          />

          <Text style={styles.loadingText}>
            Calculando melhor rota...
          </Text>

        </View>

      )}

      {/* ========================================= */}
      {/* ROUTE INFORMATION */}
      {/* ========================================= */}

      {healthUnit && (

        <View style={styles.infoContainer}>

          <Text style={styles.title}>
            🏥 {healthUnit.name}
          </Text>

          <Text style={styles.info}>
            Tipo: {healthUnit.tipo}
          </Text>

          <Text style={styles.info}>
            📍 Distância:{" "}
            {((distance ?? 0) / 1000).toFixed(2)} km
          </Text>

          <Text style={styles.info}>
            🕒 Tempo estimado:{" "}
            {Math.ceil((duration ?? 0) / 60)} minutos
          </Text>

          <View style={styles.navigationButton}>

            <Button
              title="🚗 Navegar com Google Maps"

              color="#16a34a"

              onPress={openGoogleMaps}
            />

          </View>

          <View style={styles.clearButton}>

            <Button
              title="Limpar rota"

              color="#777777"

              onPress={clearRoute}
            />

          </View>

        </View>

      )}

      {/* ========================================= */}
      {/* FIND HEALTH UNIT BUTTON */}
      {/* ========================================= */}

      <View style={styles.buttonContainer}>

        <Button
          title="Achar Unidade"

          color="#0004ff"

          onPress={findHealthUnit}
        />

      </View>

      {/* ========================================= */}
      {/* EMERGENCY BUTTON */}
      {/* ========================================= */}

      <View style={styles.buttonContainer}>

        <Button
          title="Emergência"

          color="#ec1b1b"

          onPress={sendEmergency}
        />

      </View>

      {/* ========================================= */}
      {/* LOGOUT BUTTON */}
      {/* ========================================= */}

      <View style={styles.buttonContainer}>

        <Button
          title="Sair"

          color="#555555"

          onPress={logout}
        />

      </View>

    </ThemedView>

  );

}

// ==================================================
// STYLES
// ==================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  map: {
    flex: 1,
    width: "100%",
  },

  buttonContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  loadingContainer: {
    padding: 10,
    alignItems: "center",
  },

  loading: {
    margin: 10,
  },

  loadingText: {
    marginTop: 5,
    color: "#2563eb",
    fontSize: 14,
  },

  routeLoading: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },

  infoContainer: {
    padding: 15,
    backgroundColor: "#ffffff",
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222222",
  },

  info: {
    fontSize: 14,
    color: "#555555",
    marginTop: 8,
  },

  navigationButton: {
    marginTop: 15,
  },

  clearButton: {
    marginTop: 8,
  },

});
