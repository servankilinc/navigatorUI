import PolygonGeoJson from "../models/Features/PolygonGeoJson"
import Solid, { solidFeature } from "../models/Solid";
import { ShowEntrancePoint } from "./entrancePointService";
import maplibregl from 'maplibre-gl';
 
export function ShowPolygon(polygon: PolygonGeoJson, map: maplibregl.Map): void {
  const sourceId = `_c_${polygon.geometry.type}-${polygon.properties.id}`;

  // **Eğer kaynak zaten ekliyse, sadece veriyi güncelle**
  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(polygon);
    return;
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: polygon,
  });

  // **Poligon katmanını ekle**
  map.addLayer({
    id: sourceId,
    type: 'fill',
    source: sourceId,
    paint: {
      'fill-color': '#888888', // Poligonun rengi (değiştirilebilir)
      'fill-opacity': 0.5,     // Opaklık
    },
  });

  // **Poligon üzerine pop-up ekle**
  map.on('click', sourceId, (e) => {
    const coordinates = e.lngLat;
    new maplibregl.Popup()
      .setLngLat(coordinates)
      .setHTML(polygon.properties.popupContent || '')
      .addTo(map);
  });

  // **Eğer bir giriş noktası varsa, giriş noktasını göster**
  if (polygon.properties.entrance != null) {
    ShowEntrancePoint(polygon.properties.entrance, map);
  }
}

export function ShowSolid(solid: Solid, map: maplibregl.Map): void {
  const sourceId = `_c_SolidOfFloor`;

  // **Eğer kaynak zaten ekliyse, sadece veriyi güncelle**
  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(solid as any);
    return;
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: solid as any,
  });

  // map.removeLayer("floorplan")
  map.addLayer({
    'id': sourceId,
    'type': 'fill-extrusion',
    'source': sourceId,
    'paint': {
      'fill-extrusion-color': ['get', 'color'],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'base_height'],
      'fill-extrusion-opacity': 1
    }
  });
}
 

export function HidePolygon(polygon: PolygonGeoJson, map: maplibregl.Map): void {
  const sourceId = `_c_${polygon.geometry.type}-${polygon.properties.id}`;

  // **Katmanı kaldır**
  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }

  // **Kaynağı kaldır**
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}
 
 