import { useAppSelector } from '../redux/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { ShowCurrentPoint } from '@/services/navigationService';

import { FaLocationDot } from 'react-icons/fa6';
function FindMyLocation() {

  const map = useAppSelector((state) => state.mapReducer.map);

  const currentLocation = useAppSelector((state) => state.appReducer.currentLocation);
  const isWatcherEnable = useAppSelector((state) => state.appReducer.isWatcherEnable);

  function FindMe(): void {
    if (!map || isWatcherEnable != true || currentLocation == undefined) return;

    map.flyTo({
      center: { lng: currentLocation[0], lat: currentLocation[1] }!,
      zoom: 19.5,
      speed: 0.5,
      curve: 0.5,
      essential: true,
    });
    ShowCurrentPoint(currentLocation!, map!);
  }

  if (!map || isWatcherEnable != true) return <></>;

  return (
    <Card className="m-0 p-1">
      <CardContent className="p-0 m-0">
        <Item className={'p-2 bg-white rounded-none border-0 border-neutral-200'}>
          <ItemContent onClick={FindMe}>
            <ItemTitle>
              <FaLocationDot size={25} color="#ff5200" />
            </ItemTitle>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
}

export default FindMyLocation;
