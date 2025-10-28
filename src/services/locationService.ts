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
      maximumAge: 1000, // ms, daha eski konumu kabul etme süresi
      timeout: 10000, // ms, pozisyon alınmazsa hata döndür
    }
  );
  return watchId;
}

export function StopWatch(watchId: number): void {
  navigator.geolocation.clearWatch(watchId);
}
