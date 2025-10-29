import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setLayerType } from '../redux/reducers/appSlice';
import Solid from '../models/Solid';
import { ShowLogo, ShowPolygon, ShowSolid } from '../services/polygonService';
import { Card, CardContent } from '@/components/ui/card';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { LayerTypesEnum } from '@/models/UIModels/LayerTypesEnum';
import { LuRotate3D } from "react-icons/lu";

function LayerSelection() {
  const map = useAppSelector((state) => state.mapReducer.map);

  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);

  const polygonList = useAppSelector((state) => state.storageReducer.polygons);
  const solid = useAppSelector((state) => state.storageReducer.solid);

  const currentLayerType = useAppSelector((state) => state.appReducer.layerType);

  const dispath = useAppDispatch();

  function ChangeLayerType(nextLayerType: LayerTypesEnum): void {
    if(nextLayerType === currentLayerType) return;
    ClearPolygons();
    ClearSolids();
    
    if (nextLayerType === LayerTypesEnum.UcBoyut) {
      const featuresToShow = solid.features.filter((f) => f.properties.floor == currentFloor!.index);
      const solidToShow: Solid = {
        type: 'FeatureCollection',
        features: featuresToShow,
      };
      ShowSolid(solidToShow, map!);

      map!.easeTo({ pitch: 40,   duration: 500 });
      map!.dragRotate.enable();
      map!.touchZoomRotate.enableRotation();
    } 
    else {
      polygonList.filter((f) => f.properties.floor == currentFloor!.index).map((polygon) => ShowPolygon(polygon, map!));
        
      map!.easeTo({ pitch: 0,   duration: 500 });
      map!.dragRotate.disable();
      map!.touchZoomRotate.disableRotation();
    }

    polygonList.filter((f) => f.properties.floor == currentFloor!.index).map((polygon) => ShowLogo(polygon, map!));
    dispath(setLayerType(nextLayerType))
  }

  function ClearPolygons() {
    if (map == null) return;
    map.getStyle().layers.forEach((layer) => {
      if (layer.id.startsWith('_polygon_')) {
        if (map.getLayer(layer.id)) {
          map.removeLayer(layer.id);
        }
        if (map.getSource(layer.id)) {
          map.removeSource(layer.id);
        }
      }
    });
  }

  function ClearSolids() {
    if (map == null) return;

    map.getStyle().layers.forEach((layer) => {
      if (layer.id.startsWith('_c_SolidOfFloor')) {
        if (map.getLayer(layer.id)) {
          map.removeLayer(layer.id);
        }
        if (map.getSource(layer.id)) {
          map.removeSource(layer.id);
        }
      }
    });
  }
  
  if (!map) return <></>;
  if(!currentFloor) return <></>;
  return (
    <Card className="absolute bottom-5 left-5 m-0 p-1">
      <CardContent className="p-0 m-0">
        <Item className={'py-2 mb-2 bg-white rounded-none border-0 border-b-1 border-neutral-200'}>
          <ItemContent>
            <ItemTitle>
              <LuRotate3D size={20} />
            </ItemTitle>
          </ItemContent>
        </Item>

        <Item
          onClick={() => ChangeLayerType(LayerTypesEnum.IkiBoyut)}
          className={currentLayerType == LayerTypesEnum.IkiBoyut ? 'py-2 bg-blue-500 text-white' : 'py-2 bg-white text-stone-800 rounded-none border-0 border-neutral-200'}
        >
          <ItemContent className="flex items-center">
            <ItemTitle>2D</ItemTitle>
          </ItemContent>
        </Item>

        <Item
          onClick={() => ChangeLayerType(LayerTypesEnum.UcBoyut)}
          className={currentLayerType == LayerTypesEnum.UcBoyut ? 'py-2 bg-blue-500 text-white' : 'py-2 bg-white text-stone-800 rounded-none border-0 border-neutral-200'}
        >
          <ItemContent className="flex items-center">
            <ItemTitle>3D</ItemTitle>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
}

export default LayerSelection;
