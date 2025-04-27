// --- Helper Functions (from previous answers) ---

/**
 * Calculates the distance between two points on Earth using the Haversine formula.
 * @param {number} lat1 Latitude of the first point in degrees.
 * @param {number} lon1 Longitude of the first point in degrees.
 * @param {number} lat2 Latitude of the second point in degrees.
 * @param {number} lon2 Longitude of the second point in degrees.
 * @returns {number} The distance between the two points in kilometers.
 */
export function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2:number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

/**
 * Converts degrees to radians.
 * @param {number} deg Degrees.
 * @returns {number} Radians.
 */
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// // --- Your Data and Logic ---

// // 1. Define Reference Point and Locations
// const myLat = 40.7128; // Example: New York City
// const myLon = -74.006;

// const locations = [
//   {
//     id: 1,
//     name: "Place Near Times Square",
//     latitude: 40.758,
//     longitude: -73.9855,
//   },
//   {
//     id: 2,
//     name: "Place in Los Angeles",
//     latitude: 34.0522,
//     longitude: -118.2437,
//   },
//   { id: 3, name: "Place Near Wall St", latitude: 40.7, longitude: -74.005 },
//   { id: 4, name: "Place in Brooklyn", latitude: 40.6782, longitude: -73.9442 },
//   {
//     id: 5,
//     name: "Place Far Away (London)",
//     latitude: 51.5074,
//     longitude: -0.1278,
//   },
// ];

// // --- Option 1: Calculate distances and Sort ALL locations ---

// // 2. Calculate distance for each location
// const locationsWithDistance = locations.map((location) => {
//   const distance = getDistanceFromLatLonInKm(
//     myLat,
//     myLon,
//     location.latitude,
//     location.longitude
//   );
//   // Return a new object combining original data and the distance
//   return { ...location, distance_km: distance };
// });

// // 4. Sort the locations by distance
// locationsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

// console.log("--- All locations sorted by distance: ---");
// console.log(locationsWithDistance);

// // --- Option 2: Filter THEN Sort ---

// const maxDistanceKm = 50; // Only show locations within 50km

// // 2. Calculate distance (can combine with filter)
// const nearbyLocations = locations
//   .map((location) => {
//     const distance = getDistanceFromLatLonInKm(
//       myLat,
//       myLon,
//       location.latitude,
//       location.longitude
//     );
//     return { ...location, distance_km: distance };
//   })
//   // 3. Filter based on distance
//   .filter((location) => location.distance_km <= maxDistanceKm);

// // 4. Sort the filtered locations
// nearbyLocations.sort((a, b) => a.distance_km - b.distance_km);

// console.log(
//   `\n--- Locations within ${maxDistanceKm}km, sorted by distance: ---`
// );
// console.log(nearbyLocations);
