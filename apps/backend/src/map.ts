import { protectedProcedure, router } from "./util/trpc";
import { z } from "zod";

interface Place {
  formattedAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  displayName: {
    text: string;
  };
}

interface PlacesResponse {
  places: Place[];
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
});
