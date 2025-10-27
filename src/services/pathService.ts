import LineStringGeoJson from '../models/Features/LineStringGeoJson';
import maplibregl from 'maplibre-gl';

export function ShowPath(path: LineStringGeoJson, map: maplibregl.Map): void {
  const sourceId = `_path_${path.properties.id}`;

  // **Eğer kaynak zaten ekliyse, sadece veriyi güncelle**
  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(path);
    return;
  }

  // GeoJSON Kaynağını Ekle**
  map.addSource(sourceId, {
    type: 'geojson',
    data: path,
  });

  const beforeLayer = map.getLayer('_c_SolidOfFloor');
  // Çizgi Katmanını Ekle**
  map.addLayer(
    {
      id: sourceId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#f7f7f7ff',
        'line-width': 10,
        'line-opacity': 1,
      },
    }, beforeLayer ? '_c_SolidOfFloor' : undefined
  );
}

export function HidePath(path: LineStringGeoJson, map: maplibregl.Map): void {
  const sourceId = `_path_${path.properties.id}`;

  // **Eğer katman yoksa hata fırlatmadan çık**
  if (!map.getLayer(sourceId)) return;

  // **Katmanı ve kaynağı kaldır**
  map.removeLayer(sourceId);
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}
