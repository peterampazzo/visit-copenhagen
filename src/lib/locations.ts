import { parse } from "yaml";

import locationsYaml from "../data/locations.yaml?raw";
import type { GuideItem, GuideSectionData } from "./guide-content";

type LocationRecord = {
  itemId?: string;
  label?: string;
  latitude: number;
  longitude: number;
  googleQuery: string;
};

export type GuideMapPlace = {
  id: string;
  itemId: string;
  name: string;
  note?: string;
  latitude: number;
  longitude: number;
  googleQuery: string;
  sectionId: string;
  sectionTitle: string;
  sectionEmoji: string;
  far: boolean;
};

const CITY_BOUNDS = { minLat: 55.55, maxLat: 55.8, minLng: 12.35, maxLng: 12.8 };

export function isFarFromCity(latitude: number, longitude: number) {
  return (
    latitude < CITY_BOUNDS.minLat ||
    latitude > CITY_BOUNDS.maxLat ||
    longitude < CITY_BOUNDS.minLng ||
    longitude > CITY_BOUNDS.maxLng
  );
}

const locationRecords = parse(locationsYaml) as Record<string, LocationRecord>;

export function toGuideMapPlaces(sections: GuideSectionData[]): GuideMapPlace[] {
  const items = new Map<
    string,
    { item: GuideItem; sectionId: string; sectionTitle: string; sectionEmoji: string }
  >();

  for (const section of sections) {
    for (const group of section.groups) {
      for (const item of group.items) {
        items.set(item.id, {
          item,
          sectionId: section.id,
          sectionTitle: section.title,
          sectionEmoji: section.emoji,
        });
      }
    }
  }

  return Object.entries(locationRecords).flatMap(([locationId, location]) => {
    const itemId = location.itemId ?? locationId;
    const match = items.get(itemId);
    if (!match) return [];

    return [
      {
        id: locationId,
        itemId,
        name: location.label ? `${match.item.name} · ${location.label}` : match.item.name,
        ...(match.item.note === undefined ? {} : { note: match.item.note }),
        latitude: location.latitude,
        longitude: location.longitude,
        googleQuery: location.googleQuery,
        sectionId: match.sectionId,
        sectionTitle: match.sectionTitle,
        sectionEmoji: match.sectionEmoji,
        far: isFarFromCity(location.latitude, location.longitude),
      },
    ];
  });
}

export function googleMapsUrl(place: GuideMapPlace) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.googleQuery)}`;
}
