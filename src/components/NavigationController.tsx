import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NavigationForm from './NavigationForm';
import { MapPinned } from 'lucide-react';

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
                <Button variant="outline">Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Large Screen Column Componnenet
  return (
    <Card className="w-[20vw]">
      <CardHeader className="text-start">
        <CardTitle>Rota Kontrolü</CardTitle>
        <CardDescription className="text-xs opacity-75">Gitmek istediğiniz konumu seçerek rota oluşturabilirsiniz.</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="m-0 p-0">
        <NavigationForm isSheetComponent={false} />
      </CardContent>
    </Card>
  );
}


export default NavigationController;