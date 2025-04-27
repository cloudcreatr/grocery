import { useTRPC } from "../.././util/trpc";
import { useFieldContext } from "./util";
import { useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from "react-native-maps";
import { gpsSchema } from "@repo/bg";
import {
  View,
  TextInput,
  type TextInputProps,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
type AddressProps = TextInputProps & {
  debounce?: number;
  onAddressSelect: (coords: { latitude: number; longitude: number }) => void;
};

import { z } from "zod";
import { addressSchema } from "@repo/bg";
import { twMerge } from "tailwind-merge";

export function Address(prop: AddressProps) {
  const field = useFieldContext<z.infer<typeof addressSchema>>();
  const [value, setValue] = useState<string>("");
  const [query, setQuery] = useState<string>(value);

  const t = useTRPC();
  const fv = useStore(field.store, (s) => s.value);
  const { isLoading, data } = useQuery(
    t.maps.search.queryOptions(
      {
        input: query,
      },
      {
        enabled: !!query,
      }
    )
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQuery(value);
    }, prop.debounce || 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, prop.debounce]);

  const handleSelectAddress = (address: string, lat: number, long: number) => {
    field.setValue(address);
    setValue("");
    setQuery("");
    prop.onAddressSelect({
      latitude: lat,
      longitude: long,
    });
  };

  return (
    <View className="w-full">
      <View className="bg-white border border-slate-300 rounded-2xl p-4 w-full placeholder-slate-400 flex flex-row items-center mb-2">
        <TextInput
          {...prop}
          className="flex-1 "
          value={value}
          placeholder="Enter address"
          onChangeText={(T) => setValue(T)}
        />
        {value ? (
          <TouchableOpacity onPress={() => setValue("")}>
            <Ionicons name="close-circle" size={24} color="gray" />
          </TouchableOpacity>
        ) : null}
      </View>

      {fv !== "" && (
        <View className="p-4 border border-blue-300 bg-blue-100 rounded-2xl mt-2 mb-2 ">
          <Text className="font-semibold text-blue-800">{fv}</Text>
        </View>
      )}

      {query ? (
        isLoading ? (
          <View className="p-4 border border-slate-300 rounded-2xl mt-2 bg-white">
            <Text className="font-bold italic">Loading...</Text>
          </View>
        ) : (
          <>
            {data &&
              data?.places.map((place, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-white p-4 border border-slate-300 rounded-2xl mb-2"
                  onPress={() =>
                    handleSelectAddress(
                      place.formattedAddress,
                      place.location.latitude,
                      place.location.longitude
                    )
                  }
                >
                  <Text className="font-bold text-lg text-slate-900 pb-1">
                    {place.displayName.text}
                  </Text>
                  <Text className="text-sm text-slate-500">
                    {place.formattedAddress}
                  </Text>
                </TouchableOpacity>
              ))}
          </>
        )
      ) : null}
    </View>
  );
}

export function GPS({
  onLocationSelect,
}: {
  onLocationSelect: (coords: z.infer<typeof gpsSchema>) => void;
}) {
  const [location, setLocation] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const field = useFieldContext<z.infer<typeof gpsSchema>>();

  async function getCurrentLocation() {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location2 = await Location.getCurrentPositionAsync({
        accuracy: 6,
      });

      field.setValue({
        latitude: location2.coords.latitude,
        longitude: location2.coords.longitude,
      });
      onLocationSelect({
        latitude: location2.coords.latitude,
        longitude: location2.coords.longitude,
      });
      setLocation(true);
    } catch (e) {
      setErrorMsg("Could not get location");
    } finally {
      setLoading(false);
    }
  }
  const { latitude, longitude } = useStore(field.store, (s) => s.value);
  return (
    <View>
      {latitude && longitude && latitude !== 0 ? (
        <Map location={{ latitude, longitude }} />
      ) : null}
      <TouchableOpacity
        onPress={async () => {
          await getCurrentLocation();
        }}
        className={twMerge(
          "bg-white p-4 border border-slate-300 rounded-2xl flex-row gap-2 items-center",
          location && "bg-blue-100 border-blue-300"
        )}
        disabled={errorMsg !== null || loading}
      >
        {location ? (
          <Ionicons name="checkmark-circle-outline" size={28} color="#1e40af" />
        ) : (
          <Ionicons name="location-outline" size={28} color={"#0f172a"} />
        )}
        <Text
          className={twMerge(
            "text-slate-900 font-semibold",
            location && "text-blue-800"
          )}
        >
          {errorMsg
            ? errorMsg
            : loading
              ? "Getting Location..."
              : location
                ? "Location Detected"
                : "Get Current Location"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
import { useRef } from "react";
import { CustomMarker } from "../rn";

function Map({
  location,
}: {
  location: { latitude: number; longitude: number };
}) {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.005, // Adjust for zoom level (smaller = more zoomed in)
          longitudeDelta: 0.005, // Adjust for zoom level (smaller = more zoomed in)
        },
        1000 // Animation duration in milliseconds
      );
    }
  }, [location]);

  return (
    <View
      className="w-full h-40 rounded-2xl overflow-hidden border border-slate-300 z-10 mb-2"
      style={{ overflow: "hidden" }}
    >
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 0,
        }}
        pointerEvents="none"
        showsCompass={false}
        initialRegion={{
          longitude: location.longitude,
          latitude: location.latitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Current Location"
        >
          <CustomMarker />
        </Marker>
      </MapView>
    </View>
  );
}
