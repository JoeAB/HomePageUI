import { useEffect, useState } from "react";
import { readContractData } from "../services/DesitnationLedgerService";
import type { MapMarker } from "../sharedTypes/GeoCoordinateTypes";
import MapWidget from "../components/Map";
import StarMap from "../components/StarMap";

function MiniApps() {
  const[destinationsVisited, setDestinationsVistied] = useState(Array<MapMarker>(0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locations = await readContractData();
        setDestinationsVistied(locations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchData();
  }, []);

      return (
        <>
            <MapWidget startingCoordinates={{lattitude: 39.2905, longitude:-76.6104}}
                mapMarkers={destinationsVisited} height='400px' width='600px' />
            <br />
            <StarMap />
        </>
    );
}

export default MiniApps;