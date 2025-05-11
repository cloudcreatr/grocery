import { sql } from "drizzle-orm";

export function setLocation(long: number, lat: number) {
  return sql`ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326)`;
}
export function distanceWithin(
  l: any,
  long: number,
  lat: number,
  radiusMeter: number
) {
  return sql`ST_DWithin(${l}::geography, ${setLocation(long, lat)}::geography, ${radiusMeter})`;
}

export function distanceSort(l: any, long: number, lat: number) {
  return sql<number>`ST_Distance(${l}::geography, ${setLocation(long, lat)}::geography)`;
}
