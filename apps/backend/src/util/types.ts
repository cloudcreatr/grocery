export interface Coordinate {
  latitude: number;
  longitude: number;
}

interface Viewport {
  low: Coordinate;
  high: Coordinate;
}

interface GeoJsonLinestring {
  type: "LineString";
  coordinates: [number, number][];
}

interface Polyline {
  geoJsonLinestring: GeoJsonLinestring;
}

type Route = {
  distanceMeters: number;
  staticDuration: string; // e.g., "790s"
  polyline: Polyline;
  viewport: Viewport;
};

type RoutesResponse = {
  routes: Route[];
};

type Location = {
  latLng: Coordinate;
};

type LocationPoint = { address: string } | { location: Location };

type ComputeRoutesRequest = {
  origin: LocationPoint;
  destination: LocationPoint;

  travelMode: "TWO_WHEELER";
  polylineEncoding: "GEO_JSON_LINESTRING";
};

export interface Place {
  formattedAddress: string;
  location: Coordinate;
  displayName: {
    text: string;
  };
}

export interface PlacesResponse {
  places: Place[];
}
export type { RoutesResponse, ComputeRoutesRequest };
