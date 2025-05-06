import type { Coordinate } from "@repo/bg";
import { useTRPC } from "../util/trpc";
import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { TextComponent } from "./rn";
import { GoogleMaps } from "expo-maps";
import type {
  GoogleMapsViewType,
  SetCameraPositionConfig,
} from "expo-maps/build/google/GoogleMaps.types";
import { useEffect, useRef, useState } from "react";

import Ionicons from "@expo/vector-icons/Ionicons";

export function MapComponent({
  orgin,
  destination,
  onTouchStart,
  onTouchEnd,
}: {
  orgin: Coordinate;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  destination: Coordinate;
}) {
  const cameraRef = useRef<SetCameraPositionConfig>(null);
  const t = useTRPC();
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { data, isLoading } = useQuery(
    t.maps.getRoute.queryOptions({
      origin: {
        latLng: orgin,
      },
      destination: {
        latLng: destination,
      },
    })
  );
  const ref = useRef<GoogleMapsViewType>(null);
  useEffect(() => {
    if (ref.current && data !== undefined && isMapLoaded) {
      cameraRef.current = {
        coordinates: data.viewport.high,
        zoom: 14,
      };
      ref.current.setCameraPosition({
        coordinates: data.viewport.high,
        zoom: 14,
        duration: 2000,
      });
    }
  }, [data, isMapLoaded]);

  return (
    <View className="flex flex-col gap-4">
      {isLoading ? (
        <>
          <View className="w-full h-96 rounded-2xl overflow-hidden bg-blue-100 flex justify-center items-center">
            <ActivityIndicator animating size={"large"} color={"#3b82f6"} />
          </View>
        </>
      ) : (
        <>
          <View
            className="w-full h-96 rounded-2xl overflow-hidden"
            onTouchStart={onTouchStart} // Disable scroll on map touch
            onTouchEnd={onTouchEnd} // Enable scroll after map touch
          >
            <GoogleMaps.View
              style={{ flex: 1 }}
              ref={ref}
              onMapLoaded={() => {
                setIsMapLoaded(true);
              }}
              cameraPosition={cameraRef.current ?? undefined}
              markers={[
                {
                  coordinates: orgin,
                },
                {
                  coordinates: destination,
                },
              ]}
              properties={{
                isBuildingEnabled: true,
              }}
              uiSettings={{
                compassEnabled: false,
                scaleBarEnabled: false,
                mapToolbarEnabled: false,

                zoomControlsEnabled: false,
              }}
              polylines={[
                {
                  coordinates: (
                    data?.polyline.geoJsonLinestring.coordinates ?? []
                  ).map((coordinate) => ({
                    latitude: coordinate[1],
                    longitude: coordinate[0],
                  })),
                  width: 25,
                  color: "#3b82f6",
                },
              ]}
            />
          </View>
          <View className="flex flex-row justify-evenly items-center bg-white border border-slate-200 rounded-2xl">
            <Items
              iconname="navigate-outline"
              title={data?.distanceKM ? `${data.distanceKM} km` : "0"}
              description="Distance"
            />
            <Items
              iconname="time-outline"
              title={data?.duration || "0"}
              description="Duration"
            />
          </View>
        </>
      )}
    </View>
  );
}

function Items({
  iconname,
  title,
  description,
}: {
  iconname: "navigate-outline" | "time-outline";
  title: string;
  description: string;
}) {
  return (
    <View className="flex flex-row  items-center p-3 mb-2 bg-white rounded-md">
      <Ionicons name={iconname} size={40} color="#4B5563" />
      <View className="flex flex-col ml-3">
        <TextComponent className="font-bold text-lg">{title}</TextComponent>
        <TextComponent className="text-gray-500">{description}</TextComponent>
      </View>
    </View>
  );
}
