import homepage_api_address from "../globalConfig/HomepageBackend";

interface PlaceProperties {
  name: string;
  formatted: string;
  lat: number;
  lon: number;
  distance?: number;
  place_id: string;
  categories: string[];
  city?: string;
  street?: string;
  housenumber?: string;
}

export interface Place {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: PlaceProperties;
}

interface PlacesResponse {
  type: string;
  features: Place[];
}

export class GeoapifyPlacesService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = homepage_api_address;
  }

  async searchPlaces(
    categories: string,
    lon: number,
    lat: number,
    radius: number = 5000
  ): Promise<Place[]> {
    const params = new URLSearchParams({
      categories,
      lon: lon.toString(),
      lat: lat.toString(),
      radius: radius.toString(),
    });

    const response = await fetch(`${this.baseUrl}/places/search?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch places: ${response.status}`);
    }

    const data: PlacesResponse = await response.json();

    return data.features;
  }


  async searchAttractions(
    lon: number,
    lat: number,
    radius: number = 5000
  ): Promise<Place[]> {
    const categories = ["entertainment.aquarium", 
        "entertainment.museum", "entertainment.theme_park",
        "entertainment.zoo", "leisure.park.nature_reserve", 
        "national_park", "tourism.sights.memorial.monument"]
    const categoryString = categories.join(',');
    return this.searchPlaces(categoryString, lon, lat, radius);
  }
}