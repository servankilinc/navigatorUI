import LineStringGeoJson from '../models/Features/LineStringGeoJson';
import maplibregl from "maplibre-gl";

export function ShowPath(path: LineStringGeoJson, map: maplibregl.Map): void {
  const sourceId = `_c_${path.geometry.type}-${path.properties.id}`;

  // **Eğer kaynak zaten ekliyse, sadece veriyi güncelle**
  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(path);
    return;
  }

  // **1️⃣ - GeoJSON Kaynağını Ekle**
  map.addSource(sourceId, {
    type: 'geojson',
    data: path
  });

  // **2️⃣ - Çizgi Katmanını Ekle**
  map.addLayer({
    id: sourceId,
    type: "line",
    source: sourceId,
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#3457D5", 
      "line-width": 14, 
      "line-opacity": 0.8  
    }
  });
}

export function HidePath(path: LineStringGeoJson, map: maplibregl.Map): void {
  const sourceId = `_c_${path.geometry.type}-${path.properties.id}`;

  // **Eğer katman yoksa hata fırlatmadan çık**
  if (!map.getLayer(sourceId)) return;

  // **Katmanı ve kaynağı kaldır**
  map.removeLayer(sourceId);
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}