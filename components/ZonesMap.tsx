"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { ZONES } from "@/lib/data";

const MAP_CENTER: [number, number] = [43.65, 0.65];
const MAP_ZOOM = 7;

export default function ZonesMap() {
  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={MAP_ZOOM}
      scrollWheelZoom={false}
      className="w-full h-[420px] rounded-2xl z-10"
      aria-label="Carte des zones d'intervention MEB32 dans le Sud-Ouest"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {ZONES.map((zone) => (
        <CircleMarker
          key={zone.code}
          center={zone.coords}
          radius={zone.isHQ ? 18 : 12}
          pathOptions={{
            color:       zone.isHQ ? "#C4682A" : "#1E3A5F",
            fillColor:   zone.isHQ ? "#E07B39" : "#1E3A5F",
            fillOpacity: 0.85,
            weight:      2,
          }}
        >
          <Popup>
            <div className="p-1">
              <p className="font-bold text-sm text-primary leading-tight">
                {zone.code} – {zone.name}
              </p>
              {zone.isHQ && (
                <p className="text-xs font-semibold text-accent-dark mt-0.5">
                  Siège MEB32
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                Zone d&apos;intervention couverte
              </p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
