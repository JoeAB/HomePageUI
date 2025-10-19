import type { Place } from "../services/GeoApifyService";
import './AttractionsList.css';

interface AttractionsListProps {
  attractions: Place[];
  isLoading: boolean;
  error?: string;
}

const AttractionsList: React.FC<AttractionsListProps> = ({ attractions, isLoading, error }) => {
  return (
    <div className="attractions-panel">
      <h3>Nearby Attractions</h3>

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="loading-state">
          Loading attractions...
        </div>
      )}

      {!isLoading && !error && attractions.length === 0 && (
        <div className="empty-state">
          Click on a destination marker to see nearby attractions
        </div>
      )}

      {!isLoading && !error && attractions.length > 0 && (
        <ul className="attractions-list">
          {attractions.map((attraction, index) => (
            <li key={index} className="attraction-item">
              <p className="attraction-name">{attraction.properties.name}</p>
              <p className="attraction-address">{attraction.properties.formatted}</p>
              {attraction.properties.distance && (
                <p className="attraction-distance">
                  Distance: {(attraction.properties.distance / 1000).toFixed(2)} km
                </p>
              )}
              {attraction.properties.categories && (
                <p className="attraction-distance">
                  Categories: {attraction.properties.categories.join(', ')}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttractionsList;