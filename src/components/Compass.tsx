import { useRef, useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Item, ItemContent, ItemTitle } from '@/components/ui/item';
import { PiCompassRoseFill } from 'react-icons/pi';

function Compass() {
  const map = useAppSelector((state) => state.mapReducer.map);
  const currentBearing = useAppSelector((state) => state.mapReducer.bearing);

  const [rotation, setRotation] = useState(0);
  const prevBearing = useRef<number>(0);

  useEffect(() => {
    if (prevBearing.current === undefined) {
      prevBearing.current = currentBearing;
      return;
    }

    let diff = currentBearing - prevBearing.current;

    // Smooth dönüş için açı farkını normalize et (-180 < diff < 180)
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    setRotation((prev) => prev + diff);
    prevBearing.current = currentBearing;
  }, [currentBearing]);

  if (!map) return null;

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
                  transform: `rotate(${-rotation}deg)`, // eksi yönde döndür
                  transition: 'transform 0.3s linear',
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
