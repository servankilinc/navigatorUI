import EntrancePointGeoJson from './EntrancePointGeoJson';

export default interface PolygonGeoJson extends GeoJSON.Feature<GeoJSON.Polygon> {
  properties: {
    layerId? :number;
    id: string;
    floor: number;
    name?: string;
    iconSource?: string;
    popupContent?: string;
    entrance?: EntrancePointGeoJson;
    showable: Boolean;
    priority: number;
  };
}
