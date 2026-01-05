import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapView() {
  return (
    <MapContainer center={[44.8176, 20.4633]} zoom={13} style={{ height: "400px", width: "400px" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[44.8176, 20.4633]}>
        <Popup>Test marker</Popup>
      </Marker>
    </MapContainer>
  );
}
