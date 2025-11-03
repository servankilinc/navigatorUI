import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeAlertSuccess } from '../../redux/reducers/alertSlice';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2Icon } from 'lucide-react';

export default function AlertSuccess(): React.JSX.Element {
  const dispatch = useAppDispatch();

  var _showStatus = useAppSelector((state) => state.alertReducer.successModal.showStatus);
  var _timeOut = useAppSelector((state) => state.alertReducer.successModal.timeOut);
  var _message = useAppSelector((state) => state.alertReducer.successModal.message);
  var _callback = useAppSelector((state) => state.alertReducer.successModal.callback);

  useEffect(() => {
    if (_showStatus) {
      setTimeout(() => {
        dispatch(closeAlertSuccess());
        if (_callback != undefined) {
          _callback();
        }
      }, _timeOut);
    }
  }, [_showStatus]);

  const handleShowChanges = (isOpen: boolean) => {
    if (!isOpen) dispatch(closeAlertSuccess());
  };
  
  return (
    <AlertDialog open={_showStatus} onOpenChange={(isOpen) => handleShowChanges(isOpen)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Alert>
              <CheckCircle2Icon color="#26A560" />
              <AlertTitle>{_message}</AlertTitle>
            </Alert>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Kapat</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
