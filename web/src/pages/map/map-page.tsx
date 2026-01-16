import { useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapStore } from "../../stores/map-store";
import { useBikesStore } from "../../stores/bike-store";
import { bikeApi, parkingApi } from "../../util/services";
import { findInsideSpotId } from "@app/shared";
import { bikeFreeIcon, bikeOtherIcon, parkingIcon } from "../../util/pin-colors";


export function MapPage() {
  const nav = useNavigate();

  const parkingSpots = useMapStore((s) => s.parkingSpots);
  const bikes = useBikesStore((s) => s.bikes);
  const setBikes = useBikesStore((s) => s.setBikes);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      const [spots, bs] = await Promise.all([
        parkingApi.list(ac.signal),
        bikeApi.list(ac.signal),
      ]);

      useMapStore.setState({ parkingSpots: spots });
      setBikes(bs);
    })().catch(console.error);

    return () => ac.abort();
  }, [setBikes]);

  const bikesOutside = useMemo(() => {
    return bikes.filter(b => !findInsideSpotId(b.location, parkingSpots))
  }, [bikes, parkingSpots]);

  const center: LatLngExpression =
    parkingSpots[0] ? [parkingSpots[0].location.lat, parkingSpots[0].location.lng] : [44.7866, 20.4489];

  return (
    <div style={{ position: "relative", height: "calc(100vh - 64px)" }}>
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Parking */}
        {parkingSpots.map((p) => (
          <Marker
            icon={parkingIcon}
            key={p.id}
            position={[p.location.lat, p.location.lng]}
            eventHandlers={{
              click: () => nav(`/map/parking/${p.id}`),
            }}
          >
            <Popup>{p.name}</Popup>
          </Marker>
        ))}

        {/* Bikes outside parkings */}
        {bikesOutside.map((b) => (
          <Marker
            icon={b.status === "Available" ? bikeFreeIcon : bikeOtherIcon}
            key={b.id}
            position={[b.location.lat, b.location.lng]}
            eventHandlers={{
              click: () => nav(`/map/bike/${b.id}`),
            }}
          >
            <Popup>{b.type}</Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Panel route renders here */}
      <Outlet />
    </div>
  );
}
