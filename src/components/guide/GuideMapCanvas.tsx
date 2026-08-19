import {
  GeolocateControl,
  LngLatBounds,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useRef, useState } from "react";

import type { GuideMapPlace } from "@/lib/locations";

const CLUSTER_GRID_PX = 46;

type Cluster = { key: string; places: GuideMapPlace[]; longitude: number; latitude: number };

function clusterPlaces(map: MapLibreMap, places: GuideMapPlace[], keepId: string | null) {
  const cells = new Map<string, Cluster>();
  const singles: Cluster[] = [];

  for (const place of places) {
    const point = map.project([place.longitude, place.latitude]);
    if (place.id === keepId) {
      singles.push({ key: place.id, places: [place], ...place });
      continue;
    }
    const cellKey = `${String(Math.round(point.x / CLUSTER_GRID_PX))}:${String(
      Math.round(point.y / CLUSTER_GRID_PX),
    )}`;
    const existing = cells.get(cellKey);
    if (existing) {
      existing.places.push(place);
    } else {
      cells.set(cellKey, {
        key: cellKey,
        places: [place],
        longitude: place.longitude,
        latitude: place.latitude,
      });
    }
  }

  return [...singles, ...cells.values()];
}

export function GuideMapCanvas({
  places,
  selectedId,
  onSelect,
  mapTitle,
  fitScope = "city",
  bottomPadding = 0,
}: {
  places: GuideMapPlace[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  mapTitle: string;
  fitScope?: "city" | "all";
  bottomPadding?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const stateRef = useRef({ places, selectedId, onSelect });
  stateRef.current = { places, selectedId, onSelect };

  const renderMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    const { places: current, selectedId: selected, onSelect: select } = stateRef.current;

    for (const marker of markersRef.current) marker.remove();
    markersRef.current = [];

    for (const cluster of clusterPlaces(map, current, selected)) {
      const element = document.createElement("button");
      element.type = "button";
      element.className = "guide-map-marker";

      if (cluster.places.length === 1) {
        const place = cluster.places[0];
        if (!place) continue;
        element.setAttribute("aria-label", place.name);
        element.dataset["selected"] = String(place.id === selected);
        element.dataset["far"] = String(place.far);
        const emoji = document.createElement("span");
        emoji.className = "guide-map-marker__emoji";
        emoji.setAttribute("aria-hidden", "true");
        emoji.textContent = place.sectionEmoji;
        element.append(emoji);
        element.addEventListener("click", () => select(place.id));
      } else {
        element.className = "guide-map-cluster";
        element.setAttribute("aria-label", `${String(cluster.places.length)} places`);
        element.textContent = String(cluster.places.length);
        element.addEventListener("click", () => {
          const bounds = new LngLatBounds();
          for (const place of cluster.places) bounds.extend([place.longitude, place.latitude]);
          const sameSpot =
            bounds.getNorthEast().distanceTo(bounds.getSouthWest()) < 30
              ? true
              : false;
          if (sameSpot) {
            map.easeTo({
              center: [cluster.longitude, cluster.latitude],
              zoom: Math.min(map.getZoom() + 2, 18),
              duration: 420,
            });
            return;
          }
          map.fitBounds(bounds, {
            padding: { top: 60, right: 50, bottom: bottomPadding + 40, left: 50 },
            maxZoom: 17,
            duration: 480,
          });
        });
      }

      markersRef.current.push(
        new Marker({ element, anchor: "bottom" })
          .setLngLat([cluster.longitude, cluster.latitude])
          .addTo(map),
      );
    }
  }, [bottomPadding]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MapLibreMap({
      container: containerRef.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      center: [12.575, 55.681],
      zoom: 11.5,
      attributionControl: { compact: true },
    });

    map.addControl(new NavigationControl({ showCompass: false }), "top-right");
    map.addControl(
      new GeolocateControl({ trackUserLocation: true, positionOptions: { enableHighAccuracy: true } }),
      "top-right",
    );
    mapRef.current = map;
    setMapReady(true);

    return () => {
      for (const marker of markersRef.current) marker.remove();
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    renderMarkers();
    map.on("moveend", renderMarkers);
    map.on("zoomend", renderMarkers);
    return () => {
      map.off("moveend", renderMarkers);
      map.off("zoomend", renderMarkers);
    };
  }, [mapReady, places, renderMarkers, selectedId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || places.length === 0) return;

    const nearbyPlaces = places.filter(({ far }) => !far);
    const fittingPlaces = fitScope === "all" || nearbyPlaces.length === 0 ? places : nearbyPlaces;
    const bounds = new LngLatBounds();
    for (const place of fittingPlaces) bounds.extend([place.longitude, place.latitude]);

    map.fitBounds(bounds, {
      padding: { top: 60, right: 50, bottom: bottomPadding + 40, left: 50 },
      maxZoom: 13,
      duration: 550,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitScope, mapReady, places]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !selectedId) return;
    const place = places.find(({ id }) => id === selectedId);
    if (!place) return;

    map.easeTo({
      center: [place.longitude, place.latitude],
      padding: { top: 0, right: 0, bottom: bottomPadding, left: 0 },
      duration: 420,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady, selectedId]);

  return <div ref={containerRef} className="h-full w-full" aria-label={mapTitle} />;
}
