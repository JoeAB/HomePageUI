import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import type { MapMarker } from "../sharedTypes/geoCoordinateTypes";

interface MapWidgetParameters {
    mapMarkers: MapMarker[];
}

const MapWidget: React.FC<MapWidgetParameters> = ({ mapMarkers }) => {
  return (
    <MapContainer 
      id="mapContainer" 
      center={[51.505, -0.09]} 
      zoom={13} 
      scrollWheelZoom={false}
      style={{ height: '400px', width: '400px' }}
    >
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapMarkers.map((item) => (
            <Marker position={[item.coordinates.lattitude, item.coordinates.longitude]}>
                <Popup>
                    {item.description}
                </Popup>
            </Marker>
        ))}
    </MapContainer>
  )
}

export default MapWidget