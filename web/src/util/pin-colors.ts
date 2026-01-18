import L from "leaflet";

import blue2x from "leaflet-color-markers/img/marker-icon-2x-blue.png";
import yellow2x from "leaflet-color-markers/img/marker-icon-2x-yellow.png";
import green2x from "leaflet-color-markers/img/marker-icon-2x-green.png";
import orange2x from "leaflet-color-markers/img/marker-icon-2x-orange.png";
import shadow from "leaflet-color-markers/img/marker-shadow.png";

function mk(iconRetinaUrl: string) {
  return new L.Icon({
    iconRetinaUrl,
    iconUrl: iconRetinaUrl,
    shadowUrl: shadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}

export const parkingIcon = mk(blue2x);
export const bikeAvailableIcon = mk(green2x);
export const bikeBusyIcon = mk(yellow2x);
export const bikeOtherIcon = mk(orange2x);
