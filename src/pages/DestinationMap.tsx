import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { readContractData } from "../services/DesitnationLedgerService";
import type { MapMarker, GeoCoordinate } from "../sharedTypes/GeoCoordinateTypes";
import MapWidget from "../components/Map";
import AttractionsList from "../components/AttractionsList";
import { GeoapifyPlacesService, type Place } from "../services/GeoApifyService";

function DestinationMap() {
  const [destinationsVisited, setDestinationsVistied] = useState<MapMarker[]>([]);
  const [attractions, setAttractions] = useState<Place[]>([]);
  const [attractionMarkers, setAttractionMarkers] = useState<MapMarker[]>([]);
  const [isLoadingAttractions, setIsLoadingAttractions] = useState(false);
  const [attractionsError, setAttractionsError] = useState<string>();

  const geoapifyService = new GeoapifyPlacesService();

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

  const handleMarkerClick = async (coordinates: GeoCoordinate) => {
    setIsLoadingAttractions(true);
    setAttractionsError(undefined);

    try {
      const places = await geoapifyService.searchAttractions(
        coordinates.longitude,
        coordinates.lattitude,
        5000 // 5km radius
      );

      setAttractions(places);

      const attractionMapMarkers: MapMarker[] = places.map((place) => ({
        coordinates: {
          lattitude: place.geometry.coordinates[1],
          longitude: place.geometry.coordinates[0],
        },
        description: place.properties.name,
      }));

      setAttractionMarkers(attractionMapMarkers);
    } catch (error) {
      console.error('Error fetching attractions:', error);
      setAttractionsError(
        error instanceof Error ? error.message : 'Failed to load attractions'
      );
      setAttractions([]);
      setAttractionMarkers([]);
    } finally {
      setIsLoadingAttractions(false);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="g-4">
        <Col xs={12} lg={9} className="d-flex justify-content-center">
          <div style={{ width: "100%", maxWidth: "100%", height: "600px" }}>
            <MapWidget 
              startingCoordinates={{ lattitude: 39.2905, longitude: -76.6104 }}
              mapMarkers={destinationsVisited} 
              attractionMarkers={attractionMarkers}
              onMarkerClick={handleMarkerClick}
              height='100%' 
              width='100%' 
            />
          </div>
        </Col>
        <Col xs={12} lg={3}>
          <AttractionsList 
            attractions={attractions}
            isLoading={isLoadingAttractions}
            error={attractionsError}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default DestinationMap;