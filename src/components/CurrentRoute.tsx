import { useAppSelector } from '../redux/hooks';
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@/components/ui/item';
import { useEffect, useState } from 'react';
import * as turf from "@turf/turf";
import { TbRouteAltRight } from "react-icons/tb";
import { FaAngleRight } from "react-icons/fa6";

function CurrentRoute() {
  const routeList = useAppSelector((state) => state.storageReducer.routeList);
  const polygonList = useAppSelector((state) => state.storageReducer.polygons);
  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);
  
  const startLocaltion = useAppSelector((state) => state.appReducer.startLocaltion);
  const targetLocaltion = useAppSelector((state) => state.appReducer.targetLocaltion);
  
  const [totalDistance, setTotalDistance] = useState<number | undefined>();
  
  useEffect(() => {
    if (!routeList || routeList.length <= 0) return;
    if (!currentFloor) return;
    const currentFloorRoute = routeList.find(f => f.floor == currentFloor.index);
    if (!currentFloorRoute || currentFloorRoute.path.length <=1) return;
    
    const line = turf.lineString(currentFloorRoute.path);
    const distanceInKm = turf.length(line, { units: "kilometers" });
    const distanceInMeters = distanceInKm * 1000;

    setTotalDistance(distanceInMeters);
  }, [routeList, currentFloor])
  
  if (!totalDistance || totalDistance <= 0 || !startLocaltion || !targetLocaltion || !routeList || routeList.length <= 0) return <></>;

  return (
    <Item variant="outline" className="absolute top-0 left-[40%] m-0 border-0 rounded-none rounded-b-2xl shadow-lg bg-white">
      <ItemActions className='border-r-1 p-2'>
        <TbRouteAltRight size={32} color='#2b7fff' />
      </ItemActions>
      <ItemContent>
        <ItemTitle>Oluşturlan Rota
          <hr/>
          <p> Mesafe:  {totalDistance.toFixed(0)} m </p>
        </ItemTitle >
        <ItemDescription className='flex items-center content-around gap-4'> 
	        <span className='bg-white rounded-xl p-2 m-1 shadow'>
	          {polygonList.find(f => f.properties.id == startLocaltion)?.properties.name}
	        </span>
	        <FaAngleRight size={14} />
	        <span className='bg-white rounded-xl p-2 m-1 shadow'>
	          {polygonList.find(f => f.properties.id == targetLocaltion)?.properties.name}
	        </span>     
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

export default CurrentRoute;
