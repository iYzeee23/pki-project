import type { LngLat } from "@app/shared";
import { useMapEvents } from "react-leaflet";

type MapClickParams = {
    enabled: boolean;
    onPick: (pick: LngLat) => void;
};

export function MapClickPicker(params: MapClickParams) {
    const enabled = params.enabled;
    const onPick = params.onPick;

    useMapEvents({
        click(e) {
            if (!enabled) return;

            const pick = {
                lng: e.latlng.lng,
                lat: e.latlng.lat
            } as LngLat;

            onPick(pick);
        },
    });

    return null;
}
