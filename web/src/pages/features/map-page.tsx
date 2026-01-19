import { useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { useMapStore } from "../../stores/map-store";
import { useBikesStore } from "../../stores/bike-store";
import { bikeApi, parkingApi } from "../../util/services";
import { findInsideSpotId, isCanceled, type BikeStatus } from "@app/shared";
import { bikeAvailableIcon, bikeBusyIcon, bikeOtherIcon, parkingIcon } from "../../util/pin-colors";
import { MapClickPicker } from "../../util/map-click-picker";
import { useDraftStore } from "../../stores/draft-store";
import { getApiErrorMessage } from "../../util/http";
import { SelectField } from "../../elements/select-field";
import { useTranslation } from "react-i18next";
import { mapTexts } from "../../i18n/i18n-builder";

export function MapPage() {
  const { t } = useTranslation();
  const mpp = mapTexts(t);

  const nav = useNavigate();

  const parkingSpots = useMapStore((s) => s.parkingSpots);
  const bikeStatusFilter = useMapStore(s => s.bikeStatusFilter);
  const setBikeStatusFilter = useMapStore(s => s.setBikeStatusFilter);

  const bikes = useBikesStore((s) => s.bikes);
  const setBikes = useBikesStore((s) => s.setBikes);

  const editingBikeId = useDraftStore(s => s.editingBikeId);
  const pinColor = useDraftStore(s => s.pinColor);
  const pickedLocation = useDraftStore(s => s.pickedLocation);
  const setPickedLocation = useDraftStore(s => s.setPickedLocation);

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        const [spots, bs] = await Promise.all([
          parkingApi.list(ac.signal),
          bikeApi.list(ac.signal),
        ]);

        useMapStore.setState({ parkingSpots: spots });
        setBikes(bs);
      } catch (e: any) {
        if (isCanceled(e)) return;
        console.log(getApiErrorMessage(e));
      }
    })();

    return () => ac.abort();
  }, [setBikes]);

  const bikesFiltered = useMemo(() => {
    if (bikeStatusFilter === "All") return bikes;
    return bikes.filter(b => b.status === bikeStatusFilter);
  }, [bikes, bikeStatusFilter]);

  const bikesOutside = useMemo(() => {
    return bikesFiltered.filter(b => !findInsideSpotId(b.location, parkingSpots))
  }, [bikesFiltered, parkingSpots]);

  const parkingIdsWithFilteredBikes = useMemo(() => {
    const ids = new Set<string>();

    for (const b of bikesFiltered) {
      const insideId = findInsideSpotId(b.location, parkingSpots);
      if (insideId) ids.add(insideId);
    }

    return ids;
  }, [bikesFiltered, parkingSpots]);

  const visibleParkingSpots = useMemo(() => {
    if (bikeStatusFilter === "All") return parkingSpots;
    return parkingSpots.filter(p => parkingIdsWithFilteredBikes.has(p.id));
  }, [parkingSpots, bikeStatusFilter, parkingIdsWithFilteredBikes]);

  const center: LatLngExpression = [44.80796, 20.44864];

  const isPicking = !!editingBikeId;

  return (
    <div style={{ position: "relative", height: "calc(100vh - 145px)" }}>
      <SelectField
        value={bikeStatusFilter}
        onChange={(e) => (setBikeStatusFilter(e.target.value as BikeStatus | "All")) }
      >
        <option value="All">{mpp.All}</option>
        <option value="Available">{mpp.Available}</option>
        <option value="Busy">{mpp.Busy}</option>
        <option value="Maintenance">{mpp.Maintenance}</option>
        <option value="Off">{mpp.Off}</option>
      </SelectField>

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

        {!isPicking && visibleParkingSpots.map((p) => (
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
