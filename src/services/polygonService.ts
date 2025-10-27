import PolygonGeoJson from '../models/Features/PolygonGeoJson';
import Solid from '../models/Solid';
import maplibregl from 'maplibre-gl';

export function ShowPolygon(polygon: PolygonGeoJson, map: maplibregl.Map): void {
  const sourceId = `_polygon_${polygon.properties.id}`;

  // **Eğer kaynak zaten ekliyse, sadece veriyi güncelle**
  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(polygon);
    return;
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: polygon,
  });

  map.addLayer({
    id: sourceId,
    type: 'fill',
    source: sourceId,
    paint: {
      'fill-color': '#888888',
      'fill-opacity': 0.5,
    },
  });
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
  const beforeLayerId = getBeforeLayerIdOfSolid(map);
  map.addLayer({
    id: sourceId,
    type: 'fill-extrusion',
    source: sourceId,
    paint: {
      'fill-extrusion-color': ['get', 'color'],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'base_height'],
      'fill-extrusion-opacity': 1,
    }
  }, beforeLayerId?? undefined);
}

function getBeforeLayerIdOfSolid(map: maplibregl.Map){
  const layers = map.getStyle().layers;
  const logoLayers = layers?.filter(l => l.id.startsWith('_logo'));
  return logoLayers?.length ? logoLayers[0].id : undefined;
}

export function HidePolygon(polygon: PolygonGeoJson, map: maplibregl.Map): void {
  const sourceId = `_polygon_${polygon.properties.id}`;

  // **Katmanı kaldır**
  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }

  // **Kaynağı kaldır**
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}
export async function ShowLogo(polygon: PolygonGeoJson, map: maplibregl.Map): Promise<void> {
  if (polygon.properties.iconSource == undefined || polygon.properties.iconSource.length <= 0) return;

  const sourceId = `_logo_${polygon.properties.id}`;
  const iconId = `${sourceId}_${polygon.properties.iconSource}`;

  const positionLogo = getPolygonCenter(polygon);

  const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: positionLogo,
    },
  };

  // Kaynak varsa güncelle
  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(pointGeoJson);
    return;
  }

  // İkon henüz yüklenmemişse yükle
  if (!map.hasImage(iconId)) {
    const image = await map.loadImage(`${import.meta.env.VITE_API_URL}/api/polygon/${polygon.properties.iconSource}`);

    map.addImage(iconId, image.data);
  }

  // kaynak ekle
  map.addSource(sourceId, {
    type: 'geojson',
    data: pointGeoJson,
  });

  // layer ekle
  map.addLayer({
    id: sourceId,
    type: 'symbol',
    source: sourceId,
    layout: {
      'icon-image': iconId,
      'icon-size': 0.06,
      'icon-anchor': 'bottom',
    },
  });
}

function getPolygonCenter(poly: PolygonGeoJson): [number, number] {
  if (poly.geometry.coordinates[0].length > 5 && poly.properties.entrance != null) {
    const ent = poly.properties.entrance.geometry.coordinates;
    return [ent[0], ent[1]];
  }
  const ring = poly.geometry.coordinates[0]; // outer ring
  let x = 0,
    y = 0;

  ring.forEach(([lon, lat]) => {
    x += lon;
    y += lat;
  });

  return [x / ring.length, y / ring.length];
}
