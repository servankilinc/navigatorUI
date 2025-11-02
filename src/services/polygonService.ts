import PolygonGeoJson from '../models/Features/PolygonGeoJson';
import Solid from '../models/Solid';
import maplibregl from 'maplibre-gl';

export function ShowPolygon(polygon: PolygonGeoJson, map: maplibregl.Map): void {
  if(polygon.properties.showable == false) return;
  
  const sourceId = `_polygon_${polygon.properties.id}`;

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(polygon);
    return;
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: polygon,
  });

  // polygon ilk modeden yoksa ilk logodan önce eklensin
  const beforeLayer = getFirstModelLayer(map) ?? getFirstLogoLayer(map);

  map.addLayer({
    id: sourceId,
    type: 'fill',
    source: sourceId,
    paint: {
      'fill-color': '#c7d0d8ff', 
    },
  }, beforeLayer ?? undefined);
}

export function ShowSolid(solid: Solid, map: maplibregl.Map): void {
  const sourceId = `_c_SolidOfFloor`;

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(solid as any);
    return;
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: solid as any,
  });

  // solid ilk modeden yoksa ilk logodan önce eklensin
  const beforeLayer = getFirstModelLayer(map) ?? getFirstLogoLayer(map);

  map.addLayer(
    {
      id: sourceId,
      type: 'fill-extrusion',
      source: sourceId,
      paint: {
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'base_height'],
        'fill-extrusion-opacity': 1,
      },
    }, beforeLayer ?? undefined
  );
}

export function HidePolygon(polygon: PolygonGeoJson, map: maplibregl.Map): void {
  const sourceId = `_polygon_${polygon.properties.id}`;

  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}

export async function ShowLogo(polygon: PolygonGeoJson, map: maplibregl.Map): Promise<void> {
  if (polygon.properties.iconSource == undefined || polygon.properties.iconSource.length <= 0) return;

  const sourceId = `_logo_${polygon.properties.iconSource}`;

  const positionLogo = getPolygonCenter(polygon);

  const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: positionLogo,
    },
  };
  
  if (!map.hasImage(sourceId)) {
    const image = await map.loadImage(`${import.meta.env.VITE_API_URL}/api/polygon/${polygon.properties.iconSource}`);
    map.addImage(sourceId, image.data);
  }

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(pointGeoJson);
    return;
  }
  
  map.addSource(sourceId, {
    type: 'geojson',
    data: pointGeoJson,
  });

  map.addLayer({
    id: sourceId,
    type: 'symbol',
    source: sourceId,
    layout: {
      'icon-image': sourceId,
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


function getFirstModelLayer(map: maplibregl.Map) {
  const layers = map.getStyle().layers;
  const logoLayers = layers?.filter((l) => l.id.startsWith('_model_'));
  return logoLayers?.length ? logoLayers[0].id : undefined;
}

function getFirstLogoLayer(map: maplibregl.Map) {
  const layers = map.getStyle().layers;
  const logoLayers = layers?.filter((l) => l.id.startsWith('_logo'));
  return logoLayers?.length ? logoLayers[0].id : undefined;
}