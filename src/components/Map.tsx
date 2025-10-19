import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import type { GeoCoordinate, MapMarker } from "../sharedTypes/GeoCoordinateTypes";
import L from "leaflet";

interface MapWidgetParameters {
    startingCoordinates: GeoCoordinate,
    mapMarkers: MapMarker[];
    attractionMarkers?: MapMarker[];
    onMarkerClick: (coordinates: GeoCoordinate) => void;
    height: string,
    width: string
}

const MapWidget: React.FC<MapWidgetParameters> = ({ 
  startingCoordinates, 
  mapMarkers, 
  attractionMarkers = [],
  onMarkerClick,
  height, 
  width 
}) => {
  // Different colored icons for attractions
  const attractionIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const defaultIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

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
            <Marker 
              key={`destination-${item.coordinates.lattitude}-${item.coordinates.longitude}`}
              position={[item.coordinates.lattitude, item.coordinates.longitude]}
              icon={defaultIcon}
              eventHandlers={{
                click: () => onMarkerClick(item.coordinates)
              }}
            >
                <Popup>
                    <div>
                      <p><strong>{item.description}</strong></p>
                      <small>Click to see nearby attractions</small>
                    </div>
                </Popup>
            </Marker>
        ))}
        {attractionMarkers.map((item) => (
            <Marker 
              key={`attraction-${item.coordinates.lattitude}-${item.coordinates.longitude}`}
              position={[item.coordinates.lattitude, item.coordinates.longitude]}
              icon={attractionIcon}
            >
                <Popup>
                    {item.description}
                </Popup>
            </Marker>
        ))}
    </MapContainer>
  )
}

export default MapWidget