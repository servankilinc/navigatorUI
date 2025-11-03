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
import { setAdvancedPointList, setEntrancePointList, setFloorList, setGraphList, setPathList, setPolygonList, setSolidFeatures, setThreeDModels } from './redux/reducers/storageSlice';
import { showAlertError } from './redux/reducers/alertSlice';
import { setCurrentFloor, setCurrentLocation, setIsWatcherEnable } from './redux/reducers/appSlice';
import Solid from './models/Solid';
import GraphBaseModel from './models/GraphBaseModel';
import { StartWatch, StopWatch } from './services/locationService';
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
import ThreeDModelPointGeoJson from './models/Features/ThreeDModelPointGeoJson';
import CurrentRoute from './components/CurrentRoute';
import goraLogo from './assets/gora-logo.png';

function App() {
  const dispatch = useAppDispatch();

  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);
  const map = useAppSelector((state) => state.mapReducer.map);
  const isWatcherEnable = useAppSelector((state) => state.appReducer.isWatcherEnable);


  useEffect(() => { 
    FetchData();
    
    // const watchId = StartWatch(HandlePositionChange, HandleWatchError);
    // return () => {
    //   if (watchId) StopWatch(watchId);
    // };
  }, [map]);

  function HandlePositionChange(position: GeolocationPosition): void {
    if (!map || !currentFloor || !position) return;
    if (isWatcherEnable != true) dispatch(setIsWatcherEnable(true));
    
    const currentPosition: Position = [position.coords.longitude, position.coords.latitude];
    ShowCurrentPoint(currentPosition, map);
    dispatch(setCurrentLocation(currentPosition));

    const routeList: Route[] = store.getState().storageReducer.routeList;
    const route = routeList.find((f) => f.floor === currentFloor.index);
    if (!route) return;

    ShowNextRoute(route, currentPosition, map);
  }

  function HandleWatchError(err: string | GeolocationPositionError): void {
    if (isWatcherEnable != false) dispatch(setIsWatcherEnable(false));
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
      const res_threeDModels = await fetch(`${import.meta.env.VITE_API_URL}/api/threeDModel`);

      const data_advancedPoint: AdvancedPointGeoJson[] = await res_advancedPoint.json();
      const data_entrancePoint: EntrancePointGeoJson[] = await res_entrancePoint.json();
      const data_floor: Floor[] = await res_floor.json();
      const data_graph: GraphBaseModel[] = await res_graph.json();
      const data_path: LineStringGeoJson[] = await res_path.json();
      const data_polygon: PolygonGeoJson[] = await res_polygon.json();
      const data_solid: Solid[] = await res_solid.json();
      const data_threeDModels: ThreeDModelPointGeoJson[] = await res_threeDModels.json();

      dispatch(setAdvancedPointList(data_advancedPoint));
      dispatch(setEntrancePointList(data_entrancePoint));
      dispatch(setFloorList(data_floor));
      dispatch(setPathList(data_path));
      dispatch(setPolygonList(data_polygon));
      
      if(!data_solid || data_solid.length > 0) dispatch(setSolidFeatures(data_solid[0].features));
      
      dispatch(setThreeDModels(data_threeDModels));
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
      

      dispatch(setCurrentFloor(data_floor.some((f) => f.index == 0) ? data_floor.find((f) => f.index == 0)! : data_floor[0]!));
    } catch (error) {
      dispatch(showAlertError({ message: 'Bilgiler alınırken bir hata oluştu.' }));
    }
  }

  if (!currentFloor) return <></>;

  return (
    <>
      <div className="w-screen h-[100vh] p-4">
        <div className={'relative flex gap-4 content-center w-full h-full'}>
          <Map /> 
          <CurrentRoute />
          <LayerSelection />
          <Compass />
          <div className='absolute bottom-15 2xl:right-[20vw] right-5'>
            <div className='flex items-end gap-3'>
              <FindMyLocation />
              {/* <Floors /> */}
            </div>
          </div>
          <div className='absolute bottom-0 bg-white 2xl:right-[20vw] right-5 p-3 rounded-tl-xl rounded-br-xl z-[99]' >
 
              <img src={goraLogo} alt='main-advertising' className='w-24' style={{objectFit:"contain"}} />
 
          </div>
          <NavigationController />
        </div> 
      </div>

      <AlertSuccess />
      <AlertError />
    </>
  );
}

export default App; 