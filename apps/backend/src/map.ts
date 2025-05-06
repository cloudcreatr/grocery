import { protectedProcedure, router } from "./util/trpc";
import { z } from "zod";
import type {
  ComputeRoutesRequest,
  PlacesResponse,
  RoutesResponse,
} from "./util/types";

function durationStringToMMSS(durationString: string): string {
  if (!durationString || !durationString.endsWith("s")) {
    return ""; // Or handle error appropriately
  }

  // Remove the 's' and convert to an integer
  const totalSeconds = parseInt(durationString.slice(0, -1), 10);

  if (isNaN(totalSeconds)) {
    return ""; // Or handle error appropriately
  }

  const minutes = Math.floor(totalSeconds / 60);

  const paddedMinutes = String(minutes).padStart(2, "0");

  return `${paddedMinutes} Minutes`;
}
export const maps = router({
  search: protectedProcedure
    .input(
      z.object({
        input: z.string(),
      })
    )
    .query(async (opts) => {
      const address = opts.input.input;
      console.log("address", address);
      const data = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "X-Goog-Api-Key": process.env["MAP"] || "",
            "X-Goog-FieldMask":
              "places.formattedAddress,places.displayName.text,places.location",
          },
          body: JSON.stringify({
            textQuery: address,
          }),
        }
      );
      const json = (await data.json()) as PlacesResponse;
      return json;
    }),
  getRoute: protectedProcedure
    .input(
      z.object({
        origin: z.object({
          latLng: z.object({
            latitude: z.number(),
            longitude: z.number(),
          }),
        }),
        destination: z.object({
          latLng: z.object({
            latitude: z.number(),
            longitude: z.number(),
          }),
        }),
      })
    )
    .query(async (opts) => {
      const { origin, destination } = opts.input;
      const req = await fetch(
        "https://routes.googleapis.com/directions/v2:computeRoutes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": process.env["MAP"] || "",
            "X-Goog-FieldMask":
              "routes.polyline.geoJsonLinestring,routes.staticDuration,routes.distanceMeters,routes.viewport",
          },
          body: JSON.stringify({
            origin: {
              location: {
                latLng: origin.latLng,
              },
            },
            destination: {
              location: {
                latLng: destination.latLng,
              },
            },
            travelMode: "TWO_WHEELER",
            polylineEncoding: "GEO_JSON_LINESTRING",
          } as ComputeRoutesRequest),
        }
      );
      const data = (await req.json()) as RoutesResponse;
      if (data.routes.length === 0) {
        throw new Error("No routes found");
      }
      const { distanceMeters, staticDuration, ...rest } = data.routes[0];
      return {
        distanceKM: distanceMeters / 1000,
        duration: durationStringToMMSS(staticDuration),
        ...rest,
      };
    }),
});
