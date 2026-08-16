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
};

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
      },
    ];
  });
}

export function googleMapsUrl(place: GuideMapPlace) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.googleQuery)}`;
}
