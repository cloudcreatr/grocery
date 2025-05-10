import { useTRPC } from "../.././util/trpc";
import { useFieldContext } from "./util";
import { useStore } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
    prop.onAddressSelect({
      latitude: lat,
      longitude: long,
    });
  };

  return (
    <View className="w-full">
      <TouchableOpacity
        onPress={() => {
          setIsOpen(!isOpen);
        }}
        className="bg-white p-4 border border-slate-300 rounded-2xl flex-row gap-2 items-center mb-2 justify-between"
      >
        <TextComponent>Enter Address</TextComponent>
        <Ionicons name="arrow-forward" size={28} color={"#0f172a"} />
      </TouchableOpacity>
      <Modal visible={isOpen} onRequestClose={() => setIsOpen(false)} withInput>
        <View className="bg-white w-full rounded-2xl p-4 border border-slate-200 h-5/6">
          <View className="bg-white border border-slate-300 rounded-2xl p-2 w-full placeholder-slate-400 flex flex-row items-center mb-2">
            <TextInput
              {...prop}
              className="flex-1 "
              placeholderTextColor={"#475569"}
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
          <View className="flex-1">
            {query ? (
              isLoading ? (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator />
                </View>
              ) : (
                <>
                  <ScrollView>
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
                </>
              )
            ) : (
              <View className="flex-1 justify-center items-center">
                <TextComponent className="text-slate-600">
                  Enter an address to search
                </TextComponent>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {fv !== "" && (
        <View className="p-4 border border-blue-300 bg-blue-100 rounded-2xl mt-2 mb-2 ">
          <Text className="font-semibold text-blue-800">{fv}</Text>
        </View>
      )}
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

import { type CameraPosition, GoogleMaps } from "expo-maps";

import { type GoogleMapsViewType } from "expo-maps/build/google/GoogleMaps.types";
import { TextComponent } from "../rn";
import { Modal } from "../modal";
import { ActivityIndicator } from "../loading";
function Map({
  location,
}: {
  location: { latitude: number; longitude: number };
}) {
  const ref = useRef<GoogleMapsViewType>(null);
  const cameraPos = useRef<CameraPosition>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.setCameraPosition({
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 17,
      });
      cameraPos.current = {
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 17,
      };
    }
  }, [location]);
  return (
    <View
      className="w-full h-96 rounded-3xl overflow-hidden border border-slate-300 z-10 mb-2"
      style={{ overflow: "hidden" }}
    >
      <GoogleMaps.View
        ref={ref}
        style={{ flex: 1 }}
        uiSettings={{
          compassEnabled: false,
          mapToolbarEnabled: false,
          scaleBarEnabled: false,
          scrollGesturesEnabled: false,
          zoomControlsEnabled: false,
        }}
        cameraPosition={
          cameraPos.current ?? {
            coordinates: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            zoom: 17,
          }
        }
        properties={{
          isBuildingEnabled: true,
        }}
        markers={[
          {
            coordinates: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        ]}
      />
    </View>
  );
}
