import { Position } from 'geojson';
import { store } from '../redux/store';
import { FindNearestAdvancedPoint, FindNearestNode, FindShortestPath } from './graphService';
import Route from '../models/Route';
import e7 from '../scripts/idGenerator';
import maplibregl from 'maplibre-gl';
import { HideAllEntrancePoints } from './entrancePointService';
import * as turf from '@turf/turf'

const imageUrlCurrent = `${import.meta.env.VITE_API_URL}/api/polygon/uploads/point_current.png`;
const imageUrlStart = `${import.meta.env.VITE_API_URL}/api/polygon/uploads/point_start.png`;
const imageUrlTarget = `${import.meta.env.VITE_API_URL}/api/polygon/uploads/point_target.png`;
let currentPointImageAdded = false;

export function ShowRoute(path: Position[], map: maplibregl.Map): void {
  ClearRoutes(map);

  const sourceId = `_c_route_layer`;
 
  map.addSource(sourceId, { 
    type: 'geojson', 
    data: { 
      type: 'Feature',
      geometry: { 
        type: 'LineString', 
        coordinates: path
      }, 
      properties: {} 
    } 
  });
  
  // rota pointsden önce yoksa _c_SolidOfFloor veya ilk polygondan dan önce yoksa ilk modeden eklensin
  const beforeLayer = getFirstPointLayer(map) ?? map.getLayer('_c_SolidOfFloor')?.id ?? getFirstPolygonLayer(map) ?? getFirstModelLayer(map);

  // burası konum servisinden gelecek 
  let isLocationAvailable = store.getState().appReducer.isWatcherEnable;
  if(isLocationAvailable == false){
    map.addLayer({
      id: sourceId,
      type: 'line',
      source: sourceId,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
      'line-color':  '#009CDF',
        'line-width': 8
      },
    }, beforeLayer ?? undefined);
  }
  else{ 
    map.addLayer({
      id: sourceId,
      type: 'line',
      source: sourceId,
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color':  '#cacacaff',
        'line-width': 8,
        'line-dasharray': [2, 2],
      },
    }, beforeLayer ?? undefined);  
  }
}


export function ShowNextRoute(route: Route, currentPosition: Position, map: maplibregl.Map): void {
   
  const sourceId = `_c_next_route_layer`;
 
  const path: Position[] = CalculateRemaindPath(route, currentPosition);

  map.addSource(sourceId, { 
    type: 'geojson', 
    data: { 
      type: 'Feature',
      geometry: { 
        type: 'LineString', 
        coordinates: path
      }, 
      properties: {} 
    } 
  });
  
  // rota _c_SolidOfFloor den önce eklensin
  const beforeLayer = map.getLayer('_c_SolidOfFloor');
  map.addLayer({
    id: sourceId,
    type: 'line',
    source: sourceId,
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: {
      'line-color':  'orange',
      'line-width': 8,
    },
  }, beforeLayer ? beforeLayer.id : undefined);
}


function CalculateRemaindPath(route: Route, currentPosition: Position): Position[] {
  const path = [...route.path]

  let indexOfMinDistance = 0;
  let mindistance = -1;

  for(let i = 0; i < path.length; i++){
    const route_pos = path[i];
    const distance = turf.distance(turf.point(route_pos), turf.point(currentPosition));
    if (mindistance == -1 || distance < mindistance) {
      indexOfMinDistance = i;
      mindistance = distance;
    }
  }

  return path.slice(indexOfMinDistance, path.length);
}

export async function ShowCurrentPoint(position: Position, map: maplibregl.Map) {
  HideCurrentPoint(map);
  const sourceId = `_point_current_`;
  const sourceImageId = `_point_current_img_`;

  const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: position },
    properties: {},
  };

  if (!currentPointImageAdded && !map.hasImage(sourceImageId)) {
    const image = await map.loadImage(imageUrlCurrent); 
    map.addImage(sourceImageId, image.data);
    currentPointImageAdded = true;
  }

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(pointGeoJson);
    map.triggerRepaint();
    return;
  }

  map.addSource(sourceId, { type: 'geojson', data: pointGeoJson });

  // rota  _c_SolidOfFloor veya ilk polygondan dan önce yoksa ilk modeden yoksa ilk logodan önce eklensin
  const beforeLayer = map.getLayer('_c_SolidOfFloor')?.id ?? getFirstPolygonLayer(map) ?? getFirstModelLayer(map) ?? getFirstLogoLayer(map);
  
  map.addLayer(
    {
      id: sourceId,
      type: 'symbol',
      source: sourceId,
      layout: {
        'icon-image': sourceImageId,
        'icon-size': 0.04,
        'icon-anchor': 'center', // alt kısmı koordinata yapışık
        'icon-allow-overlap': true,
        'icon-rotate': 30, // sabit yön
        'icon-rotation-alignment': 'map',
      },
    },
    beforeLayer ?? undefined
  );
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
  const sourceImageId = `_point_start_img_`;

  const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: position },
    properties: {},
  };

  if (!map.hasImage(sourceImageId)) {
    const image = await map.loadImage(imageUrlStart);
    map.addImage(sourceImageId, image.data);
  }

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(pointGeoJson);
    return;
  }

  map.addSource(sourceId, { type: 'geojson', data: pointGeoJson });

  // rota  _c_SolidOfFloor veya ilk polygondan dan önce yoksa ilk modeden yoksa ilk logodan önce eklensin
  const beforeLayer = map.getLayer('_c_SolidOfFloor')?.id ?? getFirstPolygonLayer(map) ?? getFirstModelLayer(map) ?? getFirstLogoLayer(map);

  map.addLayer(
    {
      id: sourceId,
      type: 'symbol',
      source: sourceId,
      layout: {
        'icon-image': sourceImageId,
        'icon-size': 0.03,
        'icon-anchor': 'center', // alt kısmı koordinata yapışık
        'icon-allow-overlap': true,
        'icon-rotate': 30, // sabit yön
        'icon-rotation-alignment': 'map',
      },
    },
    beforeLayer ?? undefined
  );
}
export function HideStartPoint(map: maplibregl.Map): void {
  const sourceId = `_point_start_`;
  const sourceImageId = `_point_start_img_`;

  if (map.hasImage(sourceImageId)) {
    map.removeImage(sourceImageId);
  }
  
  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}

export async function ShowTargetPoint(position: Position, map: maplibregl.Map) {
  const sourceId = `_point_target_`;
  const sourceImageId = `_point_target_img_`;

  const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: position },
    properties: {},
  };
  
  if (!map.hasImage(sourceImageId)) {
    const image = await map.loadImage(imageUrlTarget);
    map.addImage(sourceImageId, image.data);
  }

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(pointGeoJson);
    return;
  }

  map.addSource(sourceId, { type: 'geojson', data: pointGeoJson });

  // rota  _c_SolidOfFloor veya ilk polygondan dan önce yoksa ilk modeden yoksa ilk logodan önce eklensin
  const beforeLayer = map.getLayer('_c_SolidOfFloor')?.id ?? getFirstPolygonLayer(map) ?? getFirstModelLayer(map) ?? getFirstLogoLayer(map);

  map.addLayer(
    {
      id: sourceId,
      type: 'symbol',
      source: sourceId,
      layout: {
        'icon-image': sourceImageId,
        'icon-size': 0.03,
        'icon-anchor': 'center', // alt kısmı koordinata yapışık
        'icon-allow-overlap': true,
        'icon-rotate': 30, // sabit yön
        'icon-rotation-alignment': 'map',
      },
    },
    beforeLayer ?? undefined
  );
}
export function HideTargetPoint(map: maplibregl.Map): void {
  const sourceId = `_point_target_`;
  const sourceImageId = `_point_target_img_`;

  if (map.hasImage(sourceImageId)) {
    map.removeImage(sourceImageId);
  }
  
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

  const sourceId = `_c_route_layer`;

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