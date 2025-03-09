import { ListGroup } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setCurrentFloor } from '../redux/reducers/appSlice';
import { ShowEntrancePoint } from '../services/entrancePointService';
import { ShowAdvancedPoint } from '../services/advancedPointService';
import { ShowPath } from '../services/pathService';
// import CustomLayer from '../models/Features/CustomLayer';
import { ShowRoute } from '../services/navigationService';

function Floors() {
  const map = useAppSelector((state) => state.mapReducer.map);

  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);

  const floorList = useAppSelector((state) => state.storageReducer.floorList);
  // const polygonList = useAppSelector((state) => state.storageReducer.polygons);
  const pathList = useAppSelector((state) => state.storageReducer.paths);
  const entrancePointList = useAppSelector((state) => state.storageReducer.entrancePoints);
  const advancedPointList = useAppSelector((state) => state.storageReducer.advancedPoints);
  const routeList = useAppSelector((state) => state.storageReducer.routeList);

  const dispath = useAppDispatch();

  function SwipeFloor(floorIndex: number): void {
    const nextFloor = floorList.find((f) => f.index == floorIndex)!;

    dispath(setCurrentFloor(nextFloor));
    ClearLayers();
    
    // polygonList
    //   .filter((f) => f.properties.floor == nextFloor.index)
    //   .map((polygon) => {
    //     ShowPolygon(polygon, map!);
    //   });


    // entrancePointList
    //   .filter((f) => f.properties.floor == nextFloor.index)
    //   .map((entrancePoint) => {
    //     ShowEntrancePoint(entrancePoint, map!);
    //   });

    advancedPointList
      .filter((f) => f.properties.floor == nextFloor.index)
      .map((advancedPoint) => {
        ShowAdvancedPoint(advancedPoint, map!);
      });

    pathList
      .filter((f) => f.properties.floor == nextFloor.index)
      .map((path) => {
        ShowPath(path, map!);
      });
      
    routeList
      .filter((f) => f.floor == nextFloor.index)
      .map((route) => {
        ShowRoute(route.path, map!);
      });
  }

  
  function ClearRouteLayers() {
    if(map == null) return;
    map.getStyle().layers.forEach(layer => {
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
    if(map == null) return;
 
    map.getStyle().layers.forEach(layer => {
      if(layer.id.startsWith('_c_')){   
        console.log("TEMIZLENMEK ISTENEN", layer);
        if (map.getLayer(layer.id)) {
          map.removeLayer(layer.id);
        }
        if (map.getSource(layer.id)) {
          map.removeSource(layer.id);
        }
      }
    });
  }
  
  return (
    <ListGroup className="shadow">
      <ListGroup.Item className="bg-light text-primary fw-bold">Kat Listesi</ListGroup.Item>
      <ListGroup.Item className="p-0 border-0">
        {floorList != null && map != null &&
          floorList.map((floor) => {
            const active = currentFloor != null && floor.id == currentFloor.id;
            return (
              <ListGroup.Item key={floor.id} onClick={() => SwipeFloor(floor.index)} className={`fw-light text-start`} active={active}>
                {floor.name}
              </ListGroup.Item>
            );
          })}
      </ListGroup.Item>
    </ListGroup>
  );
}

export default Floors;
