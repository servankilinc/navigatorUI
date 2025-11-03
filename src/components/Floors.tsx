import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setCurrentFloor } from '../redux/reducers/appSlice';
import { ShowAdvancedPoint } from '../services/advancedPointService';
import { ShowPath } from '../services/pathService';
import { ShowRoute } from '../services/navigationService';
import Solid from '../models/Solid';
import { ShowLocationPoint, ShowLogo, ShowPolygon, ShowSolid } from '../services/polygonService';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { BetweenHorizontalEnd } from 'lucide-react';
import { LayerTypesEnum } from '@/models/UIModels/LayerTypesEnum';
import { Show3DModel } from '@/services/threeDModelService';

function Floors() {
  const map = useAppSelector((state) => state.mapReducer.map);

  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);
  const currentLayerType = useAppSelector((state) => state.appReducer.layerType);

  const floorList = useAppSelector((state) => state.storageReducer.floorList);
  const polygonList = useAppSelector((state) => state.storageReducer.polygons);
  const pathList = useAppSelector((state) => state.storageReducer.paths);
  const advancedPointList = useAppSelector((state) => state.storageReducer.advancedPoints);
  const routeList = useAppSelector((state) => state.storageReducer.routeList);
  const solid = useAppSelector((state) => state.storageReducer.solid);
  const threeDModelList = useAppSelector((state) => state.storageReducer.threeDModels);

  const dispath = useAppDispatch();

  useEffect(() => {
    if (!map) return;
    if (!currentFloor) return;
    const floorIndex = currentFloor?.index;

    advancedPointList.filter((f) => f.properties.floor == floorIndex).map((advancedPoint) => ShowAdvancedPoint(advancedPoint, map));
    pathList.filter((f) => f.properties.floor == floorIndex).map((path) => ShowPath(path, map!));
    routeList.filter((f) => f.floor == floorIndex).map((route) => ShowRoute(route.path, map));
    threeDModelList.filter((f) => f.properties.floor == floorIndex).map((d) => Show3DModel(d, map));

    if (currentLayerType === LayerTypesEnum.UcBoyut) {
      const featuresToShow = solid.features.filter((f) => f.properties.floor == floorIndex);
      const solidToShow: Solid = {
        type: 'FeatureCollection',
        features: featuresToShow,
      };
      ShowSolid(solidToShow, map);
    } else {
      polygonList.filter((f) => f.properties.floor == floorIndex).map((polygon) => ShowPolygon(polygon, map));
    }

    polygonList.filter((f) => f.properties.floor == floorIndex).map((polygon) => ShowLogo(polygon, map));

    // mescit ve wc için eklendi
    polygonList.filter((f) => f.properties.floor == floorIndex).map((polygon) => ShowLocationPoint(polygon, map));

  }, [currentFloor, map]);

  function SwipeFloor(floorIndex: number): void {
    // ClearLayers();
    // ClearRouteLayers();

    const nextFloor = floorList.find((f) => f.index == floorIndex)!;

    dispath(setCurrentFloor(nextFloor));
  }

  function ClearRouteLayers() {
    if (map == null) return;
    map.getStyle().layers.forEach((layer) => {
      if (layer.id.startsWith('route-layer')) {
        if (map.getLayer(layer.id)) {
          map.removeLayer(layer.id);
        }
        if (map.getSource(layer.id)) {
          map.removeSource(layer.id);
        }
      }
    });
  }

  function ClearLayers() {
    if (map == null) return;

    map.getStyle().layers.forEach((layer) => {
      if (layer.id.startsWith('_')) {
        if (map.getLayer(layer.id)) {
          map.removeLayer(layer.id);
        }
        if (map.getSource(layer.id)) {
          map.removeSource(layer.id);
        }
      }
    });
  }

  if (!map || !floorList || floorList.length <=1) return <></>;

  return (
    <Card className="m-0 p-1">
      <CardContent className="p-0 m-0">
        <Item className={'py-2 mb-2 bg-white rounded-none border-0 border-neutral-200'}>
          <ItemContent>
            <ItemTitle>
              <BetweenHorizontalEnd size={20} />
            </ItemTitle>
          </ItemContent>
        </Item>
        {floorList.map((floor) => {
          const active = currentFloor != null && floor.id == currentFloor.id;
          return (
            <Item
              key={floor.id}
              onClick={() => SwipeFloor(floor.index)}
              className={active ? 'py-2 bg-blue-500 text-white' : 'py-2 bg-white text-stone-800 rounded-none border-0 border-neutral-200'}
            >
              <ItemContent className="flex items-center">
                <ItemTitle>{floor.index}</ItemTitle>
              </ItemContent>
            </Item>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default Floors;
