import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationForm from './NavigationForm';
import { MapPinned } from 'lucide-react';
import mainAdvertising from '../assets/main-advertising.png';

function NavigationController(): React.JSX.Element {
  const [isLarge, setIsLarge] = useState(window.innerWidth >= 1536);

  useEffect(() => {
    const handleResize = () => setIsLarge(window.innerWidth >= 1536);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Small Screen Sheet Componnent
  if (!isLarge) {
    return (
      <div className="absolute top-5 right-5">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <MapPinned />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Rota Kontrolü</SheetTitle>
              <SheetDescription>Gitmek istediğiniz konumu seçerek rota oluşturabilirsiniz.</SheetDescription>
            </SheetHeader>
            <NavigationForm isSheetComponent={true} />
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Kapat</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  }
 
  // Large Screen Column Componnenet
  return (
    <div className='w-[20vw] flex flex-col' style={{justifyContent: "space-between"}}>
      <Card className="h-auto m-0">
        <CardHeader className="text-start">
          <CardTitle>Rota Kontrolü</CardTitle>
          <CardDescription className="text-xs opacity-75">Gitmek istediğiniz konumu seçerek rota oluşturabilirsiniz.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="m-0 p-0">
          <NavigationForm isSheetComponent={false} />
        </CardContent>
      </Card>
      <div className='w-[19.2vw]  rounded-xl shadow' style={{overflow: "hidden"}}>
          <img src={mainAdvertising} alt='main-advertising' className='w-100' style={{objectFit:"contain"}} />
      </div>
    </div>
  );
}


export default NavigationController;