import { LngLatBounds, Map as MapLibreMap, Marker, NavigationControl, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

import { googleMapsUrl, type GuideMapPlace } from "@/lib/locations";

function popupContent(place: GuideMapPlace, googleMapsLabel: string) {
  const content = document.createElement("div");
  content.className = "guide-map-popup";

  const heading = document.createElement("p");
  heading.className = "guide-map-popup__title";
  heading.textContent = `${place.sectionEmoji} ${place.name}`;
  content.append(heading);

  if (place.note) {
    const note = document.createElement("p");
    note.className = "guide-map-popup__note";
    note.textContent = place.note;
    content.append(note);
  }

  const link = document.createElement("a");
  link.className = "guide-map-popup__link";
  link.href = googleMapsUrl(place);
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = `${googleMapsLabel} ↗`;
  content.append(link);

  return content;
}

export function GuideMapCanvas({
  places,
  selectedId,
  onSelect,
  googleMapsLabel,
  mapTitle,
}: {
  places: GuideMapPlace[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  googleMapsLabel: string;
  mapTitle: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef(new Map<string, { marker: Marker; element: HTMLButtonElement }>());
  const popupRef = useRef<Popup | null>(null);
  const [mapReady, setMapReady] = useState(false);

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
    mapRef.current = map;
    setMapReady(true);
    const markers = markersRef.current;

    return () => {
      popupRef.current?.remove();
      markers.clear();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;
    const markers = markersRef.current;

    for (const { marker } of markers.values()) marker.remove();
    markers.clear();

    for (const place of places) {
      const element = document.createElement("button");
      element.type = "button";
      element.className = "guide-map-marker";
      element.setAttribute("aria-label", place.name);
      element.dataset["selected"] = "false";
      const emoji = document.createElement("span");
      emoji.className = "guide-map-marker__emoji";
      emoji.setAttribute("aria-hidden", "true");
      emoji.textContent = place.sectionEmoji;
      element.append(emoji);
      element.addEventListener("click", () => onSelect(place.id));

      const marker = new Marker({ element, anchor: "bottom" })
        .setLngLat([place.longitude, place.latitude])
        .addTo(map);
      markers.set(place.id, { marker, element });
    }

    return () => {
      for (const { marker } of markers.values()) marker.remove();
      markers.clear();
    };
  }, [mapReady, onSelect, places]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || places.length === 0) return;

    const nearbyPlaces = places.filter(
      ({ latitude, longitude }) =>
        latitude >= 55.6 && latitude <= 55.8 && longitude >= 12.4 && longitude <= 12.75,
    );
    const fittingPlaces = nearbyPlaces.length >= Math.min(3, places.length) ? nearbyPlaces : places;
    const bounds = new LngLatBounds();
    for (const place of fittingPlaces) bounds.extend([place.longitude, place.latitude]);

    map.fitBounds(bounds, {
      padding: { top: 70, right: 55, bottom: 55, left: 55 },
      maxZoom: 13,
      duration: 550,
    });
  }, [mapReady, places]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    for (const [id, { element }] of markersRef.current) {
      element.dataset["selected"] = String(id === selectedId);
    }

    popupRef.current?.remove();
    popupRef.current = null;
    if (!selectedId) return;

    const place = places.find(({ id }) => id === selectedId);
    if (!place) return;

    popupRef.current = new Popup({ offset: 24, maxWidth: "290px" })
      .setLngLat([place.longitude, place.latitude])
      .setDOMContent(popupContent(place, googleMapsLabel))
      .addTo(map);
    map.easeTo({ center: [place.longitude, place.latitude], duration: 420 });
  }, [googleMapsLabel, mapReady, places, selectedId]);

  return <div ref={containerRef} className="h-full w-full" aria-label={mapTitle} />;
}
