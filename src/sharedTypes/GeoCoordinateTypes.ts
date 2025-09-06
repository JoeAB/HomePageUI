export interface GeoCoordinate{
    lattitude: number;
    longitude: number;
}

export interface MapMarker{
    coordinates: GeoCoordinate;
    description: string;
}