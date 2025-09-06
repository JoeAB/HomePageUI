import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import type { GeoCoordinate, MapMarker } from "../sharedTypes/GeoCoordinateTypes";

interface MapWidgetParameters {
    startingCoordinates: GeoCoordinate,
    mapMarkers: MapMarker[];
    height: string,
    width: string
}

const MapWidget: React.FC<MapWidgetParameters> = ({ startingCoordinates, mapMarkers, height, width }) => {
  return (
    <MapContainer 
      id="mapContainer" 
      center={[startingCoordinates.lattitude, startingCoordinates.longitude]} 
      zoom={11} 
      scrollWheelZoom={true}
      style={{ height: height, width: width }}
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