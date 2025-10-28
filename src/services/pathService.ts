import LineStringGeoJson from '../models/Features/LineStringGeoJson';
import maplibregl from 'maplibre-gl';

export function ShowPath(path: LineStringGeoJson, map: maplibregl.Map): void {
  const sourceId = `_path_${path.properties.id}`;

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(path);
    return;
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: path,
  });


  // yollar varsa _c_route_layer den önce yoksa _c_SolidOfFloor den önce eklensin
  const beforeLayer = map.getLayer('_c_route_layer') ?? map.getLayer('_c_SolidOfFloor');
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
    },
    beforeLayer ? '_c_SolidOfFloor' : undefined
  );
}

export function HidePath(path: LineStringGeoJson, map: maplibregl.Map): void {
  const sourceId = `_path_${path.properties.id}`;

  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}
