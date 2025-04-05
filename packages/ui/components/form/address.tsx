import { useTRPC } from "../.././util/trpc";
import { useFieldContext } from "./util";
import { useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
      <View className="bg-white border border-slate-300 rounded-2xl p-4 w-full placeholder-slate-400 flex flex-row items-center">
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
        <View className="p-4 border-2 border-blue-500 rounded-2xl mt-2 bg-white">
          <Text className="font-semibold">{fv}</Text>
        </View>
      )}

      {query ? (
        isLoading ? (
          <View className="p-4 border border-slate-300 rounded-2xl mt-2 bg-white">
            <Text className="font-bold italic">Loading...</Text>
          </View>
        ) : (
          <ScrollView className="h-70 mt-2">
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
          </ScrollView>
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

  console.log("GPS", field.state.value.latitude);
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

  return (
    <TouchableOpacity
      onPress={async () => {
        await getCurrentLocation();
      }}
      className="bg-blue-100 p-4 border border-blue-200 rounded-2xl flex-row items-center justify-between mt-2"
      disabled={errorMsg !== null || loading}
    >
      <Text className="text-blue-900 font-semibold">
        {errorMsg
          ? errorMsg
          : loading
            ? "Loading..."
            : location
              ? "Location found"
              : "Get Location"}
      </Text>
      <Ionicons name="location-outline" size={30} color={"#1e3a8a"} />
    </TouchableOpacity>
  );
}
