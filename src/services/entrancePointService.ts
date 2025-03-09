import EntrancePointGeoJson from "../models/Features/EntrancePointGeoJson";
import maplibregl from "maplibre-gl";

export function ShowEntrancePoint(entrancePoint: EntrancePointGeoJson, map: maplibregl.Map): void {
  const sourceId = `_c_${entrancePoint.geometry.type}-${entrancePoint.properties.id}`;

  // Eğer marker zaten eklenmişse tekrar eklemeyelim
  if (document.getElementById(sourceId)) return;

  // Yeni bir marker oluştur
  const marker = new maplibregl.Marker({
    color: "#ff0000" // Marker rengi
  })
    .setLngLat([entrancePoint.geometry.coordinates[0], entrancePoint.geometry.coordinates[1]]) // Koordinatları ayarla
    .setPopup(new maplibregl.Popup().setText(`Giriş Noktası: ${entrancePoint.properties.id}`)) // Açılır bilgi penceresi
    .addTo(map);

  // Marker'ı DOM'a eklemek için bir ID verelim
  marker.getElement().id = sourceId;
}

export function HideEntrancePoint(entrancePoint: EntrancePointGeoJson): void {
  const sourceId = `_c_${entrancePoint.geometry.type}-${entrancePoint.properties.id}`;
  
  const markerElement = document.getElementById(sourceId);

  // Eğer marker mevcutsa, DOM'dan kaldır
  if (markerElement) {
    markerElement.remove();
  }
}
