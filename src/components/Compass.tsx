import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { PiCompassRoseFill } from 'react-icons/pi';
function Compass() {
  const dispath = useAppDispatch();

  const map = useAppSelector((state) => state.mapReducer.map);

  const currentBearing = useAppSelector((state) => state.mapReducer.bearing);

  if (!map) return <></>;

  return (
    <Card className="absolute top-5 left-5 m-0 p-1">
      <CardContent className="p-0 m-0">
        <Item className={'p-2 bg-white rounded-none border-0 border-neutral-200'}>
          <ItemContent>
            <ItemTitle>
              <PiCompassRoseFill
                size={30}
                color="#ff5200"
                style={{
                  transform: `rotate(${currentBearing * -1}deg)`, // eksi yönde döndür, ikon kuzeyi göstersin
                  transition: 'transform 0.3s ease',
                }}
              />
            </ItemTitle>
          </ItemContent>
        </Item>
      </CardContent>
    </Card>
  );
}

export default Compass;
