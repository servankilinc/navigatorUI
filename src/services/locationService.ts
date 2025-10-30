type PositionCallback = (position: GeolocationPosition) => void;
type ErrorCallback = (err: GeolocationPositionError | string) => void;

export function StartWatch(onChange: PositionCallback, onError: ErrorCallback): number | void {
  if (!('geolocation' in navigator)) {
    onError('Geolocation API desteklenmiyor');
    return;
  }

  const watchId: number = navigator.geolocation.watchPosition(
    (pos) => onChange(pos),
    (err) => onError(err),
  {
    enableHighAccuracy: true,
    timeout: 30000,       // biraz daha yüksek zaman ver
    maximumAge: 0          // eski konumu kullanma
  }
  );
  return watchId;
}

export function StopWatch(watchId: number): void {
  navigator.geolocation.clearWatch(watchId);
}
