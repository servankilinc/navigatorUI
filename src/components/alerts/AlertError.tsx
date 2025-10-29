import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { closeAlertError } from '../../redux/reducers/alertSlice';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';

export default function AlertError(): React.JSX.Element {
  const dispatch = useAppDispatch();

  var _showStatus = useAppSelector((state) => state.alertReducer.errorModal.showStatus);
  var _timeOut = useAppSelector((state) => state.alertReducer.errorModal.timeOut);
  var _message = useAppSelector((state) => state.alertReducer.errorModal.message);
  var _callback = useAppSelector((state) => state.alertReducer.errorModal.callback);

  useEffect(() => {
    if (_showStatus) {
      setTimeout(() => {
        dispatch(closeAlertError());
        if (_callback != undefined) {
          _callback();
        }
      }, _timeOut);
    }
  }, [_showStatus]);

  const handleShowChanges = (isOpen: boolean) => {
    if (!isOpen) dispatch(closeAlertError());
  };

  return (
    <AlertDialog open={_showStatus} onOpenChange={(isOpen) => handleShowChanges(isOpen)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>{_message}</AlertTitle>
            </Alert>
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
