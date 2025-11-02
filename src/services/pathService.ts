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


  // yollar varsa _c_route_layer den önce yoksa points den önce yoksa solid veya polygon'dan önce eklensin
  const beforeLayer = map.getLayer('_c_route_layer')?.id ?? getFirstPointLayer(map) ?? map.getLayer('_c_SolidOfFloor')?.id ?? getFirstPolygonLayer(map);
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
    beforeLayer ?? undefined
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

function getFirstPointLayer(map: maplibregl.Map) {
  const layers = map.getStyle().layers;
  const logoLayers = layers?.filter((l) => l.id.startsWith('_point_'));
  return logoLayers?.length ? logoLayers[0].id : undefined;
}


function getFirstPolygonLayer(map: maplibregl.Map) {
  const layers = map.getStyle().layers;
  const logoLayers = layers?.filter((l) => l.id.startsWith('_polygon_'));
  return logoLayers?.length ? logoLayers[0].id : undefined;
}