import { Position } from 'geojson';
import { store } from '../redux/store';
import { FindNearestAdvancedPoint, FindNearestNode, FindShortestPath } from './graphService';
import Route from '../models/Route';
import e7 from '../scripts/idGenerator';
import maplibregl from 'maplibre-gl';
import { HideAllEntrancePoints } from './entrancePointService';


  const imageUrlCurrent = `${import.meta.env.VITE_API_URL}/api/polygon/uploads/point_current.png`;
  const imageUrlStart = `${import.meta.env.VITE_API_URL}/api/polygon/uploads/point_start.png`;
  const imageUrlTarget = `${import.meta.env.VITE_API_URL}/api/polygon/uploads/point_target.png`;

export function ShowRoute(path: Position[], map: maplibregl.Map): void {
  ClearRoutes(map);

  const sourceId = `_c_route-layer`;

  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [] }, properties: {} } });

    map.addLayer({
      id: sourceId,
      type: 'line',
      source: sourceId,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': 'orange',
        'line-width': 6,
        'line-opacity': 1,
        'line-dasharray': [2, 2], // noktalı çizgi
      },
    });
  }

  // Animasyon: koordinatları yavaşça ekle
  let i = 0;
  const coords: Position[] = [];

  function drawStep() {
    if (i >= path.length) return;
    coords.push(path[i]);
    i++;

    const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
    source.setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} });

    requestAnimationFrame(drawStep); // Her frame'de bir sonraki noktayı ekle
  }

  drawStep();
}


export async function ShowCurrentPoint(position: Position, map: maplibregl.Map) {
  const sourceId = `_point_current_`; 

  if (!map.hasImage(sourceId)) {
    const image = await map.loadImage(imageUrlCurrent);
    map.addImage(sourceId, image.data);
  }

  const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: position },
    properties: {},
  };

  // Source ekle veya güncelle
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, { type: 'geojson', data: pointGeoJson });

    map.addLayer({
  id: sourceId,
  type: 'symbol',
  source: sourceId,
  layout: {
          'icon-image': sourceId,
          'icon-size': 0.05,
          'icon-anchor': 'bottom',   // alt kısmı koordinata yapışık
          'icon-allow-overlap': true,
          'icon-rotate': 30,    // sabit yön
          'icon-rotation-alignment': 'map',
  },
    });
  } else {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(pointGeoJson);
  }
}
export function HideCurrentPoint(map: maplibregl.Map): void { 
  const sourceId = `_point_current_`;
 
  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}


export async function ShowStartPoint(position: Position, map: maplibregl.Map) {
  const sourceId = `_point_start_`;

  if (!map.hasImage(sourceId)) {
    const image = await map.loadImage(imageUrlStart);
    map.addImage(sourceId, image.data);
  }

  const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: position },
    properties: {},
  };

  // Source ekle veya güncelle
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, { type: 'geojson', data: pointGeoJson });

    map.addLayer({
  id: sourceId,
  type: 'symbol',
  source: sourceId,
  layout: {
          'icon-image': sourceId,
          'icon-size': 0.05,
          'icon-anchor': 'bottom',   // alt kısmı koordinata yapışık
          'icon-allow-overlap': true,
          'icon-rotate': 30,    // sabit yön
          'icon-rotation-alignment': 'map',
  },
    });
  } else {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(pointGeoJson);
  }
}
export function HideStartPoint(map: maplibregl.Map): void { 
  const sourceId = `_point_start_`;
 
  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}


export async function ShowTargetPoint(position: Position, map: maplibregl.Map) {
  const sourceId = `_point_target_`;

  if (!map.hasImage(sourceId)) {
    const image = await map.loadImage(imageUrlTarget);
    map.addImage(sourceId, image.data);
  }

  const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: position },
    properties: {},
  };

  // Source ekle veya güncelle
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, { type: 'geojson', data: pointGeoJson });

    map.addLayer({
  id: sourceId,
  type: 'symbol',
  source: sourceId,
  layout: {
          'icon-image': sourceId,
          'icon-size': 0.05,
          'icon-anchor': 'bottom',   // alt kısmı koordinata yapışık
          'icon-allow-overlap': true,
          'icon-rotate': 30,    // sabit yön
          'icon-rotation-alignment': 'map',
  },
    });
  } else {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(pointGeoJson);
  }
}
export function HideTargetPoint(map: maplibregl.Map): void { 
  const sourceId = `_point_target_`;
 
  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}


export function ClearRoutes(map: maplibregl.Map): void {
  HideAllEntrancePoints();
  HideStartPoint(map);
  HideCurrentPoint(map);
  HideTargetPoint(map);

  const sourceId = `_c_route-layer`;

  // **Katmanı ve Kaynağı kontrol et ve kaldır**
  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}

export function GenerateRoutes(startPolyId: string, targetPolyId: string) {
  const polygonList = store.getState().storageReducer.polygons;
  const startPoly = polygonList.find((f) => f.properties.id == startPolyId);
  const targetPoly = polygonList.find((f) => f.properties.id == targetPolyId);
  if (startPoly == null || targetPoly == null) throw new Error('Start or Target locations not found');

  if (startPoly.properties.entrance == null || targetPoly.properties.entrance == null) throw new Error('Entrance poin colud not found in polygon on finding nearest node');

  const nearestNodeToStart = FindNearestNode(startPoly.properties.entrance.geometry.coordinates, startPoly.properties.floor);
  const nearestNodeToTarget = FindNearestNode(targetPoly.properties.entrance.geometry.coordinates, targetPoly.properties.floor);

  const tempRouteList: Route[] = [];
  // 1) İki konum da aynı katta ise
  if (startPoly.properties.floor == targetPoly.properties.floor) {
    const route = FindShortestPath(nearestNodeToStart.coordinate, nearestNodeToTarget.coordinate, startPoly.properties.floor);

    tempRouteList.push({
      id: e7(),
      floor: startPoly.properties.floor,
      path: route,
    });
  }
  // 2) Başlangıç konumu üstte veya aşağıda ise
  else {
    const direction = startPoly.properties.floor > targetPoly.properties.floor;

    const floorDiff = direction ? startPoly.properties.floor - targetPoly.properties.floor : targetPoly.properties.floor - startPoly.properties.floor;

    const nearestAdvancedPoint = direction ? FindNearestAdvancedPoint(startPoly, targetPoly, 'down') : FindNearestAdvancedPoint(startPoly, targetPoly, 'up');

    for (let index = 0; index < floorDiff; index++) {
      if (index == 0) {
        // Başlangıç Konumunun Bullunduğu Katı
        const nearestNodeToAdvancedPoint = FindNearestNode(nearestAdvancedPoint.geometry.coordinates, startPoly.properties.floor);

        const route = FindShortestPath(nearestNodeToStart.coordinate, nearestNodeToAdvancedPoint.coordinate, startPoly.properties.floor);

        tempRouteList.push({
          id: e7(),
          floor: startPoly.properties.floor,
          path: route,
        });
      } else if (floorDiff - index > 1) {
        // Ara Kat
        // Todo: Arak Katlar için Görselleştirme Eklenmeli
      } else {
        // Hedef Konumun Bullunduğu Kat
        const nearestNodeToAdvancedPoint = FindNearestNode(nearestAdvancedPoint.geometry.coordinates, targetPoly.properties.floor);

        const route = FindShortestPath(nearestNodeToTarget.coordinate, nearestNodeToAdvancedPoint.coordinate, targetPoly.properties.floor);

        tempRouteList.push({
          id: e7(),
          floor: targetPoly.properties.floor,
          path: route,
        });
      }
    }
  }
  return tempRouteList;
}
