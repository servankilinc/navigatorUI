import EntrancePointGeoJson from '../models/Features/EntrancePointGeoJson';
import maplibregl from 'maplibre-gl';

const entranceMarkers: Record<string, maplibregl.Marker> = {};

export function ShowEntrancePoint(entrancePoint: EntrancePointGeoJson, map: maplibregl.Map): void {
  const sourceId = `_entrancePoint_${entrancePoint.properties.id}`;

  // Eğer marker zaten eklenmişse tekrar eklemeyelim
  if (document.getElementById(sourceId)) return;

  // Yeni bir marker oluştur
  const marker = new maplibregl.Marker({
    color: '#ff0000', // Marker rengi
  })
    .setLngLat([entrancePoint.geometry.coordinates[0], entrancePoint.geometry.coordinates[1]]) // Koordinatları ayarla
    .setPopup(new maplibregl.Popup().setText(`Giriş Noktası: ${entrancePoint.properties.id}`)) // Açılır bilgi penceresi
    .addTo(map);

  // Marker'ı DOM'a eklemek için bir ID verelim
  marker.getElement().id = sourceId;
  
  entranceMarkers[sourceId] = marker;
}
export function HideEntrancePoint(entrancePoint: EntrancePointGeoJson): void {
  const sourceId = `_entrancePoint_${entrancePoint.properties.id}`;
  const marker = entranceMarkers[sourceId];
  if (marker) {
    marker.remove();
    delete entranceMarkers[sourceId];
  }
}

export function HideAllEntrancePoints(): void {
  Object.values(entranceMarkers).forEach(marker => marker.remove());
  Object.keys(entranceMarkers).forEach(key => delete entranceMarkers[key]);
}