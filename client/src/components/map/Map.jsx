import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import "./map.scss";
import "leaflet/dist/leaflet.css";
import { Pin } from "../pin/Pin";

// Map size after render
const MapResizeHandler = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    const timeout = setTimeout(() => {
      map.invalidateSize();
      map.setView(center, zoom, {
        animate: false,
      });
    }, 200);

    return () => clearTimeout(timeout);
  }, [map, center, zoom]);

  return null;
};

export const Map = ({ items = [] }) => {
  const mapCenter =
    items.length === 1
      ? [
          Number(items[0].latitude),
          Number(items[0].longitude),
        ]
      : [20.5937, 78.9629];

  const mapZoom = items.length === 1 ? 13 : 5;

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={false}
      className="map"
    >
      {/* Map resize handler */}
      <MapResizeHandler
        center={mapCenter}
        zoom={mapZoom}
      />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {items.map((item) => (
        <Pin
          key={item.id}
          item={item}
        />
      ))}
    </MapContainer>
  );
};