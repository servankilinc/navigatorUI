import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { showAlertError, showAlertSuccess } from '../redux/reducers/alertSlice';
import Route from '../models/Route';
import { setRoutes } from '../redux/reducers/storageSlice';
import { ClearRoutes, GenerateRoutes, ShowRoute, ShowStartPoint, ShowTargetPoint } from '../services/navigationService';
import { ShowEntrancePoint } from '../services/entrancePointService';
import Combobox, { selectItem } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { IoNavigateCircle, IoTrash } from 'react-icons/io5';
import { setStartLocation, setTargetLocation } from '@/redux/reducers/appSlice';
import { FaMosque } from 'react-icons/fa6';
import { FaRestroom } from 'react-icons/fa';

function NavigationForm(props: { isSheetComponent: boolean }): React.JSX.Element {
  const dispatch = useAppDispatch();
  const map = useAppSelector((state) => state.mapReducer.map);

  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);
  const entrancePointList = useAppSelector((state) => state.storageReducer.entrancePoints);
  const polygonList = useAppSelector((state) => state.storageReducer.polygons);

  const startLocaltion = useAppSelector((state) => state.appReducer.startLocaltion);
  const targetLocaltion = useAppSelector((state) => state.appReducer.targetLocaltion);

  useEffect(() => {
    if (startLocaltion && targetLocaltion) {
      HandleNavigation();
    }
  }, [startLocaltion, targetLocaltion]);

  function HandleSelectStartLocation(value: string | undefined): void {
    dispatch(setStartLocation(value));
  }

  function HandleSelectTargetLocation(value: string | undefined): void {
    dispatch(setTargetLocation(value));
  }

  function HandleNavigation(): void {
    try {
      if (!map) return;

      if (startLocaltion == null || targetLocaltion == null) throw new Error('Lütfen konum seçiniz!');
      if (startLocaltion == targetLocaltion) throw new Error('Lütfen farklı bir konum seçiniz!');
      
      const tempRouteList: Route[] = GenerateRoutes(startLocaltion, targetLocaltion);
      
      const startPoint = entrancePointList.find((f) => f.properties.polygonId == startLocaltion);
      const targetPoint = entrancePointList.find((f) => f.properties.polygonId == targetLocaltion);
      if (startPoint == null || targetPoint == null) throw new Error('Lütfen konum seçiniz!');

      const currentResult = tempRouteList.find((f) => f.floor == currentFloor?.index);
      if (currentResult != null) {
        if (startPoint) ShowEntrancePoint(startPoint, map);
        if (targetPoint) ShowEntrancePoint(targetPoint, map);
        ShowStartPoint(currentResult.path[0], map);
        ShowTargetPoint(currentResult.path[currentResult.path.length - 1], map);

        ShowRoute(currentResult.path, map!);

        const midPoint = [
          (startPoint.geometry.coordinates[0] + targetPoint.geometry.coordinates[0]) / 2,
          (startPoint.geometry.coordinates[1] + targetPoint.geometry.coordinates[1]) / 2
       ]
        map.flyTo({
          center: { lng: midPoint[0], lat: midPoint[1] }!,
          bearing: 90,
          pitch: 20,  
          zoom: 19.5,
          speed: 0.5,
          curve: 0.5,
          essential: true,
        });
      }

      dispatch(setRoutes(tempRouteList));
    } catch (error) {
      dispatch(showAlertSuccess({ message: (error as Error).message }));
    }
  }

  function HandleClear(): void {
    try {
      dispatch(setStartLocation(undefined));
      dispatch(setTargetLocation(undefined));
      ClearRoutes(map!);
    } catch (error) {
      dispatch(showAlertError({ message: (error as Error).message }));
    }
  }
  
  function GoToMescit() {
    const polyMescit = polygonList.find((f) => f.properties.name?.toLowerCase().includes('mesc'));
    if (!polyMescit) return;
    dispatch(setTargetLocation(polyMescit.properties.id));
  }
  function GoToRestRoom() {
    const polyWc = polygonList.find((f) => f.properties.name?.toLowerCase().includes('wc'));
    if (!polyWc) return;
    dispatch(setTargetLocation(polyWc.properties.id));
  }
  if (!map) return <></>;
  if (!polygonList) return <></>;

  return (
    <div className="flex flex-col p-3 pb-0 gap-6" style={{ justifyContent: 'space-between' }}>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <p className="text-start text-xs font-light ps-2">Başlangıç Konum</p>
          <Combobox
            selectedValue={startLocaltion}
            setSelectedValue={HandleSelectStartLocation}
            selectItems={polygonList.filter((f) => f.properties.name != null).sort((a ,b) => a.properties.priority - b.properties.priority).map((x) => new selectItem(x.properties.name?.toUpperCase()!, x.properties.id, x.properties.name!))}
            placeholder="Seçiniz"
            width={props.isSheetComponent ? 360 : undefined}
          />
        </div>
        <div className="grid gap-2">
          <p className="text-start text-xs font-light ps-2">Hedef Konum</p>
          <Combobox
            selectedValue={targetLocaltion}
            setSelectedValue={HandleSelectTargetLocation}
            selectItems={polygonList.filter((f) => f.properties.name != null).sort((a, b) => a.properties.priority - b.properties.priority).map((x) => new selectItem(x.properties.name?.toUpperCase()!, x.properties.id, x.properties.name!))}
            placeholder="Seçiniz"
            width={props.isSheetComponent ? 360 : undefined}
          />
        </div>
      </div>
      <div className="flex content-between items-center gap-2">
        <Button className="bg-blue-600 w-[250px]" onClick={HandleNavigation}>
          <IoNavigateCircle color="white" />
        </Button>
        <Button variant="destructive" onClick={HandleClear}>
          <IoTrash color="white" />
        </Button>
      </div>

      <div className="flex content-between items-center gap-2">
        <Button variant="outline" className='bg-green-600' onClick={GoToMescit}>
          <FaMosque color="#fff" />
        </Button>
        <Button variant="outline" className='bg-yellow-500' onClick={GoToRestRoom}>
          <FaRestroom color="#fff" />
        </Button>
      </div>
    </div>
  );
}

export default NavigationForm;
