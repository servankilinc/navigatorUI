import { Position } from 'geojson';
import { store } from '../redux/store';
import { FindNearestAdvancedPoint, FindNearestNode, FindShortestPath } from './graphService';
import Route from '../models/Route';
import e7 from '../scripts/idGenerator';
import maplibregl from "maplibre-gl";

export function ShowRoute(path: Position[], map: maplibregl.Map): void  {
  ClearRoutes(map);

  const sourceId = `_c_route-layer`;

  const coordinates = path.map(([lng, lat]) => [lng, lat]);
  // **Kaynak ve Katman Ekleme**
  map.addSource(sourceId, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: coordinates,
      },
      properties: {
      }
    },
  });

  map.addLayer({
    id: sourceId,
    type: 'line',
    source: sourceId,
    paint: {
      'line-color': 'orange',
      'line-width': 24,
      'line-opacity': 1,
    },
  });
}

export function ClearRoutes(map: maplibregl.Map): void {
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
  const startPoly = polygonList.find(f => f.properties.id == startPolyId);
  const targetPoly = polygonList.find(f => f.properties.id == targetPolyId);
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
      path: route
    });
  }

  // 2) Başlangıç konumu üstte veya aşağıda ise
  else {
    const direction = startPoly.properties.floor > targetPoly.properties.floor;

    const floorDiff = direction ? startPoly.properties.floor - targetPoly.properties.floor : targetPoly.properties.floor - startPoly.properties.floor;

    const nearestAdvancedPoint = direction ? FindNearestAdvancedPoint(startPoly, targetPoly, "down") : FindNearestAdvancedPoint(startPoly, targetPoly, "up");

    for (let index = 0; index < floorDiff; index++) {
      if (index == 0) { // Başlangıç Konumunun Bullunduğu Katı
        const nearestNodeToAdvancedPoint = FindNearestNode(nearestAdvancedPoint.geometry.coordinates, startPoly.properties.floor);

        const route = FindShortestPath(nearestNodeToStart.coordinate, nearestNodeToAdvancedPoint.coordinate, startPoly.properties.floor);

        tempRouteList.push({
          id: e7(),
          floor: startPoly.properties.floor,
          path: route
        });
      }
      else if (floorDiff - index > 1) { // Ara Kat
        // Todo: Arak Katlar için Görselleştirme Eklenmeli
      }
      else { // Hedef Konumun Bullunduğu Kat
        const nearestNodeToAdvancedPoint = FindNearestNode(nearestAdvancedPoint.geometry.coordinates, targetPoly.properties.floor);

        const route = FindShortestPath(nearestNodeToTarget.coordinate, nearestNodeToAdvancedPoint.coordinate, targetPoly.properties.floor);

        tempRouteList.push({
          id: e7(),
          floor: targetPoly.properties.floor,
          path: route
        });
      }
    }
  }
  return tempRouteList;
}