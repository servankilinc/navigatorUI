import AdvancedPointGeoJson from '../models/Features/AdvancedPointGeoJson';
import AdvancedPointTypes from '../models/UIModels/AdvancedPointTypes';
import maplibregl from 'maplibre-gl';

export async function ShowAdvancedPoint(advancedPoint: AdvancedPointGeoJson, map: maplibregl.Map): Promise<void> {
  const sourceId = `_c_${advancedPoint.geometry.type}-${advancedPoint.properties.id}`;
 
  // **1️⃣ - İkon belirleme**
  let iconKey = "default-icon"; // Varsayılan ikon anahtarı
  let iconUrl = "https://www.shutterstock.com/image-vector/down-icon-arrow-flat-illustration-260nw-1466039051.jpg"; // Varsayılan ikon URL

  switch (advancedPoint.properties.type) {
    case AdvancedPointTypes.elevator:
      iconKey = "elevator-icon";
      iconUrl = "https://cdn-icons-png.flaticon.com/512/190/190169.png";
      break;
    case AdvancedPointTypes.stairs:
      iconKey = "stairs-icon";
      iconUrl = "https://www.pngkey.com/png/detail/593-5931583_stairs-computer-icons-stair-climbing-stairs-icon-png.png";
      break;
  }

    // Eğer kaynak zaten ekliyse, sadece veriyi güncelle
  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(advancedPoint);
    return;
  }

  // **2️⃣ - Haritaya GeoJSON kaynağı ekleme**
  map.addSource(sourceId, {
    type: 'geojson',
    data: advancedPoint
  });


  const iconSourceId = `_c_${iconKey}${sourceId}`
  
  // **3️⃣ - Eğer ikon yoksa, ekleyelim ve sonra layer ekleyelim**
  if (!map.hasImage(iconSourceId)) {
    const image = await map.loadImage(iconUrl);
    map.addImage(iconSourceId, image.data);
  } 
  if (!map.getLayer(sourceId)) {
    map.addLayer({
      id: sourceId,
      type: "symbol",
      source: sourceId,
      layout: {
        "icon-image": iconKey, // Kullanılacak ikon
        "icon-size": 0.5, // İkonun boyutu
        "icon-anchor": "bottom", // İkon hizalaması
      }
    }); 
  }
}
  
export function HideAdvancedPoint(advancedPoint: AdvancedPointGeoJson, map: maplibregl.Map): void {
  const sourceId = `_c_${advancedPoint.geometry.type}-${advancedPoint.properties.id}`;
  
  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }
  
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}
