import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { showAlertError, showAlertSuccess } from '../redux/reducers/alertSlice';
import Route from '../models/Route';
import { setRoutes } from '../redux/reducers/storageSlice';
import { ClearRoutes, GenerateRoutes, ShowRoute, ShowStartPoint, ShowTargetPoint } from '../services/navigationService';
import { ShowEntrancePoint } from '../services/entrancePointService';
import Combobox, { selectItem } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { IoNavigateCircle, IoTrash } from 'react-icons/io5';

function NavigationForm(props: {isSheetComponent: boolean}): React.JSX.Element {
  const dispatch = useAppDispatch();
  const map = useAppSelector((state) => state.mapReducer.map);

  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);
  const entrancePointList = useAppSelector((state) => state.storageReducer.entrancePoints);
  const polygonList = useAppSelector((state) => state.storageReducer.polygons);

  const [startPolyId, setStartPolyId] = useState<string>();
  const [targetPolyId, setTargetPolyId] = useState<string>();

  function HandleNavigation(): void {
    try {
      if (!map) return;

      if (startPolyId == null || targetPolyId == null) throw new Error('Lütfen konum seçiniz!');

      const tempRouteList: Route[] = GenerateRoutes(startPolyId, targetPolyId);

      const startPoint = entrancePointList.find((f) => f.properties.polygonId == startPolyId);
      const targetPoint = entrancePointList.find((f) => f.properties.polygonId == targetPolyId);

      const currentResult = tempRouteList.find((f) => f.floor == currentFloor?.index);
      if (currentResult != null) {
        if (startPoint) ShowEntrancePoint(startPoint, map);
        if (targetPoint) ShowEntrancePoint(targetPoint, map);
        ShowStartPoint(currentResult.path[0], map);
        ShowTargetPoint(currentResult.path[currentResult.path.length - 1], map);

        ShowRoute(currentResult.path, map!);
      }

      dispatch(setRoutes(tempRouteList));
    } catch (error) {
      dispatch(showAlertSuccess({ message: (error as Error).message }));
    }
  }

  function HandleClear(): void {
    try {
      ClearRoutes(map!);
    } catch (error) {
      dispatch(showAlertError({ message: (error as Error).message }));
    }
  }

  if (!map) return <></>;
  if (!polygonList) return <></>;

  return (
    <div className="flex flex-col p-3 gap-6">
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <p className="text-start text-xs font-light ps-2">Başlangıç Konum</p>
          <Combobox
            selectedValue={startPolyId}
            setSelectedValue={setStartPolyId}
            selectItems={polygonList.filter((f) => f.properties.name != null).map((x) => new selectItem(x.properties.name!, x.properties.id))}
            placeholder="Seçiniz"
            width={props.isSheetComponent ? 360 : undefined}
          />
        </div>
        <div className="grid gap-2">
          <p className="text-start text-xs font-light ps-2">Hedef Konum</p>
          <Combobox
            selectedValue={targetPolyId}
            setSelectedValue={setTargetPolyId}
            selectItems={polygonList.filter((f) => f.properties.name != null).map((x) => new selectItem(x.properties.name!, x.properties.id))}
            placeholder="Seçiniz"
            width={props.isSheetComponent ? 360 : undefined}
          />
        </div>
      </div>
      <div className="flex content-between items-center gap-2">
        <Button className="bg-blue-600 w-[100px]" onClick={HandleNavigation}>
          <IoNavigateCircle color="white" />
        </Button>
        <Button variant="destructive" onClick={HandleClear}>
          <IoTrash color="white" />
        </Button>
      </div>
    </div>
  );
}

export default NavigationForm;
