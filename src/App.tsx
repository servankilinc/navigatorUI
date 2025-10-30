import './App.css';
import React, { useEffect } from 'react';
import AlertSuccess from '@/components/alerts/AlertSuccess';
import AlertError from '@/components/alerts/AlertError';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import Map from '@/components/Map';
import AdvancedPointGeoJson from './models/Features/AdvancedPointGeoJson';
import EntrancePointGeoJson from './models/Features/EntrancePointGeoJson';
import Floor from './models/Floor';
import Graph from './models/Graph';
import LineStringGeoJson from './models/Features/LineStringGeoJson';
import PolygonGeoJson from './models/Features/PolygonGeoJson';
import { setAdvancedPointList, setEntrancePointList, setFloorList, setGraphList, setPathList, setPolygonList, setSolidFeatures } from './redux/reducers/storageSlice';
import { showAlertError } from './redux/reducers/alertSlice';
import { setCurrentFloor, setCurrentLocation, setIsWatcherEnable } from './redux/reducers/appSlice';
import Solid from './models/Solid';
import GraphBaseModel from './models/GraphBaseModel';
import { StartWatch } from './services/locationService';
import { store } from './redux/store';
import Route from './models/Route';
import { ShowCurrentPoint, ShowNextRoute } from './services/navigationService';
import { Position } from 'geojson';
import Floors from './components/Floors';
import NavigationController from './components/NavigationController';
import { Button } from './components/ui/button';
import LayerSelection from './components/LayerSelection';
import Compass from './components/Compass';
import FindMyLocation from './components/FindMyLocation';

function App() {
  const dispatch = useAppDispatch();

  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);
  const map = useAppSelector((state) => state.mapReducer.map);
  const isWatcherEnbale = useAppSelector((state) => state.appReducer.isWatcherEnable);


  useEffect(() => {
    console.info(import.meta.env)
    StartWatch(HandlePositionChange, HandleWatchError);
    HandlePositionChange(undefined);
    FetchData();
  }, []);

  function HandlePositionChange(position: GeolocationPosition | undefined): void {
    if (isWatcherEnbale != true) dispatch(setIsWatcherEnable(true));

    if (!map || !currentFloor) return;
    const routeList: Route[] = store.getState().storageReducer.routeList;
    const route = routeList.find((f) => f.floor === currentFloor.index);
    if (!route) return;

    const currentPosition: Position = position != undefined ? [position.coords.longitude, position.coords.latitude] : [32.4837723400532, 37.8755113836849];

    ShowCurrentPoint(currentPosition, map);
    ShowNextRoute(route, currentPosition, map);

    dispatch(setCurrentLocation(currentPosition));
  }

  function HandleWatchError(err: string | GeolocationPositionError): void {
    if (isWatcherEnbale != false) dispatch(setIsWatcherEnable(false));
  }

  async function FetchData() {
    try {
      const res_advancedPoint = await fetch(`${import.meta.env.VITE_API_URL}/api/advancedPoint`);
      const res_entrancePoint = await fetch(`${import.meta.env.VITE_API_URL}/api/entrancePoint`);
      const res_floor = await fetch(`${import.meta.env.VITE_API_URL}/api/floor`);
      const res_graph = await fetch(`${import.meta.env.VITE_API_URL}/api/graph`);
      const res_path = await fetch(`${import.meta.env.VITE_API_URL}/api/path`);
      const res_polygon = await fetch(`${import.meta.env.VITE_API_URL}/api/polygon`);
      const res_solid = await fetch(`${import.meta.env.VITE_API_URL}/api/solid`);

      const data_advancedPoint: AdvancedPointGeoJson[] = await res_advancedPoint.json();
      const data_entrancePoint: EntrancePointGeoJson[] = await res_entrancePoint.json();
      const data_floor: Floor[] = await res_floor.json();
      const data_graph: GraphBaseModel[] = await res_graph.json();
      const data_path: LineStringGeoJson[] = await res_path.json();
      const data_polygon: PolygonGeoJson[] = await res_polygon.json();
      const data_solid: Solid[] = await res_solid.json();

      dispatch(setAdvancedPointList(data_advancedPoint));
      dispatch(setEntrancePointList(data_entrancePoint));
      dispatch(setFloorList(data_floor));
      
      // GRAPHMODEL to GRAPH CONVERT
      if (data_graph && data_graph.length > 0) {
        const _graphList: Graph[] = [];
        data_graph.forEach((pd) => {
          let _graph = new Graph(pd.floor);
          _graph.nodes = pd.nodes;
          _graph.edges = pd.edges;

          pd.edges.forEach((edge) => {
            _graph.graphGraphLib.setNode(edge.source);
            _graph.graphGraphLib.setNode(edge.target);
            _graph.graphGraphLib.setEdge(edge.source, edge.target, edge.weight);
          });
          _graphList.push(_graph);
        });
        dispatch(setGraphList(_graphList));
      }
      dispatch(setPathList(data_path));
      dispatch(setPolygonList(data_polygon));
      dispatch(setSolidFeatures(data_solid[0].features));

      // dispatch(showAlertSuccess({ message: "Veriler başarıyal getirildi." }));

      dispatch(setCurrentFloor(data_floor.some((f) => f.index == 0) ? data_floor.find((f) => f.index == 0)! : data_floor[0]!));
    } catch (error) {
      dispatch(showAlertError({ message: 'Bilgiler alınırken bir hata oluştu.' }));
    }
  }

  if (!currentFloor) return <></>;

  return (
    <>
      <div className="w-screen h-screen p-4">
        <div className={'relative flex 2xl:flex-row gap-4 content-center w-full h-full'}>
          <Map /> 
          <LayerSelection />
          <Compass />
          <div className='absolute bottom-10 2xl:right-88 right-5'>
            <div className='flex gap-3'>
              <FindMyLocation />
              <Floors />
            </div>
          </div>
          <NavigationController />
        </div> 
      </div>

      <AlertSuccess />
      <AlertError />
      {
        import.meta.env.MODE == 'development' && 
        <div className="col-span-2">
          <div className="flex-col gap-4">
            <Button variant="outline" onClick={() => HandlePositionChange(undefined)}>Where am I</Button>
            <Button variant="outline" onClick={() => {console.log(map?.getStyle().layers)}}>Layer Yazdır</Button>
          </div>
        </div>
      }
    </>
  );
}

export default App; 