import { useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapStore } from "../../stores/map-store";
import { useBikesStore } from "../../stores/bike-store";
import { bikeApi, parkingApi } from "../../util/services";
import { findInsideSpotId } from "@app/shared";
import { bikeAvailableIcon, bikeBusyIcon, bikeOtherIcon, parkingIcon } from "../../util/pin-colors";
import { MapClickPicker } from "../../util/map-click-picker";
import { useDraftStore } from "../../stores/draft-store";

export function MapPage() {
  const nav = useNavigate();

  const parkingSpots = useMapStore((s) => s.parkingSpots);
  const bikes = useBikesStore((s) => s.bikes);
  const setBikes = useBikesStore((s) => s.setBikes);

  const editingBikeId = useDraftStore(s => s.editingBikeId);
  const pinColor = useDraftStore(s => s.pinColor);
  const pickedLocation = useDraftStore(s => s.pickedLocation);
  const setPickedLocation = useDraftStore(s => s.setPickedLocation);

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

  const center: LatLngExpression = [44.80796, 20.44864];

  const isPicking = !!editingBikeId;

  return (
    <div style={{ position: "relative", height: "calc(100vh - 64px)" }}>
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }}>
        <MapClickPicker
          enabled={!!editingBikeId}
          onPick={pick => setPickedLocation(pick)}
        />

        {editingBikeId && pickedLocation && pinColor ? (
          <Marker
            position={[pickedLocation.lat, pickedLocation.lng]}
            icon={pinColor}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const m = e.target as L.Marker;
                const p = m.getLatLng();
                setPickedLocation({ lng: p.lng, lat: p.lat });
              },
            }}
          />
        ) : null}

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {!isPicking && parkingSpots.map((p) => (
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

        {!isPicking && bikesOutside.map((bike) => {
              const pinColor = bike.status === "Available" ?
                  bikeAvailableIcon : bike.status === "Busy" ?
                  bikeBusyIcon : bikeOtherIcon;

          return <Marker
            icon={pinColor}
            key={bike.id}
            position={[bike.location.lat, bike.location.lng]}
            eventHandlers={{
              click: () => nav(`/map/bike/${bike.id}`),
            }}
          >
            <Popup>{bike.type}</Popup>
          </Marker>
        })}
      </MapContainer>

      <Outlet />
    </div>
  );
}
