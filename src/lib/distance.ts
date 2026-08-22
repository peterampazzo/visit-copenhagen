const EARTH_RADIUS_METERS = 6_371_000;

export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

export function formatDistance(meters: number): string {
  if (meters < 1_000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1_000).toFixed(1).replace(".0", "")} km`;
}

export function walkingMinutes(meters: number): number {
  // Average walking speed ~1.4 m/s, i.e. ~84 m/min.
  return Math.round(meters / 84);
}
