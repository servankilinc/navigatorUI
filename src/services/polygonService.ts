import PolygonGeoJson from '../models/Features/PolygonGeoJson';
import Solid from '../models/Solid';
import maplibregl from 'maplibre-gl';

export function ShowPolygon(polygon: PolygonGeoJson, map: maplibregl.Map): void {
  if(polygon.properties.showable == false) return;
  
  const sourceId = `_polygon_${polygon.properties.id}`;

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(polygon);
    return;
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: polygon,
  });

  // polygon ilk modeden yoksa ilk logodan önce eklensin
  const beforeLayer = getFirstModelLayer(map) ?? getFirstLogoLayer(map);

  map.addLayer({
    id: sourceId,
    type: 'fill',
    source: sourceId,
    paint: {
      'fill-color': '#c7d0d8ff', 
    },
  }, beforeLayer ?? undefined);
}

export function ShowSolid(solid: Solid, map: maplibregl.Map): void {
  const sourceId = `_c_SolidOfFloor`;

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(solid as any);
    return;
  }

  map.addSource(sourceId, {
    type: 'geojson',
    data: solid as any,
  });

  // solid ilk modeden yoksa ilk logodan önce eklensin
  const beforeLayer = getFirstModelLayer(map) ?? getFirstLogoLayer(map);

  map.addLayer(
    {
      id: sourceId,
      type: 'fill-extrusion',
      source: sourceId,
      paint: {
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'base_height'],
        'fill-extrusion-opacity': 1,
      },
    }, beforeLayer ?? undefined
  );
}

export function HidePolygon(polygon: PolygonGeoJson, map: maplibregl.Map): void {
  const sourceId = `_polygon_${polygon.properties.id}`;

  if (map.getLayer(sourceId)) {
    map.removeLayer(sourceId);
  }

  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}

export async function ShowLogo(polygon: PolygonGeoJson, map: maplibregl.Map): Promise<void> {
  if(import.meta.env.VITE_SHOW_TEXT == 1) {
    ShowText(polygon, map);
    return;
  }
  if (polygon.properties.iconSource == undefined || polygon.properties.iconSource.length <= 0) return;

  const sourceId = `_logo_${polygon.properties.iconSource}`;

  const positionLogo = getPolygonCenter(polygon);

  const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: positionLogo,
    },
  };
  
  if (!map.hasImage(sourceId)) {
    const image = await map.loadImage(`${import.meta.env.VITE_API_URL}/api/polygon/${polygon.properties.iconSource}`);
    map.addImage(sourceId, image.data);
  }

  if (map.getSource(sourceId)) {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(pointGeoJson);
    return;
  }
  
  map.addSource(sourceId, {
    type: 'geojson',
    data: pointGeoJson,
  });

  map.addLayer({
    id: sourceId,
    type: 'symbol',
    source: sourceId,
    layout: {
      'icon-image': sourceId,
      'icon-size': 0.04,
      'icon-anchor': 'top',
    },
  });
}

 export async function ShowText(polygon: PolygonGeoJson, map: maplibregl.Map): Promise<void> {
  if (!polygon.properties?.name) return;

  const sourceId = `_label_${polygon.properties.name}`;
  const positionLabel = getPolygonCenter(polygon);

  const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    properties: { name: polygon.properties.name },
    geometry: { type: 'Point', coordinates: positionLabel },
  };

  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, { type: 'geojson', data: pointGeoJson });
  } else {
    (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(pointGeoJson);
  }

  if (!map.getLayer(sourceId)) {
    map.addLayer({
      id: sourceId,
      type: 'symbol',
      source: sourceId,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 8,
        'text-anchor': 'center',
        'text-allow-overlap': true,
      },
      paint: {
        'text-color': '#272727ff',
      },
    });
  }
}

// CIRCLE WHITE BACKGROUND
// export async function ShowLogo(polygon: PolygonGeoJson, map: maplibregl.Map): Promise<void> {
//   if(import.meta.env.VITE_SHOW_TEXT == true) {
//     ShowText(polygon, map);
//     return;
//   }
//   if (!polygon.properties?.name) return;
//    const sourceId = `_logo_${polygon.properties.iconSource}`;
//   const positionLogo = getPolygonCenter(polygon);

//   const pointGeoJson: GeoJSON.Feature<GeoJSON.Point> = {
//     type: 'Feature',
//     properties: {},
//     geometry: {
//       type: 'Point',
//       coordinates: positionLogo,
//     },
//   };

//   // --- RESİM YÜKLEME VE CANVAS ÜZERİNDE YUVARLAK ARKAPLAN OLUŞTURMA ---
//   if (!map.hasImage(sourceId)) {
//     const response = await fetch(`${import.meta.env.VITE_API_URL}/api/polygon/${polygon.properties.iconSource}`);
//     const blob = await response.blob();
//     const bitmap = await createImageBitmap(blob);

//     const size = 960; // Görüntü boyutu (istenirse ayarlanabilir)
//     const canvas = document.createElement('canvas');
//     canvas.width = size;
//     canvas.height = size;
//     const ctx = canvas.getContext('2d')!;

//     // 1️⃣ Beyaz daire çiz
//     ctx.beginPath();
//     ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
//     ctx.fillStyle = 'white';
//     ctx.fill();

//     // 2️⃣ Daire içine ikon çiz
//     ctx.save();
//     ctx.clip();
//     const iconSize = size * 0.8; // ikonun çember içinde kaplayacağı oran
//     const offset = (size - iconSize) / 2;
//     ctx.drawImage(bitmap, offset, offset, iconSize, iconSize);
//     ctx.restore();

//     // 3️⃣ MapLibre’ye ekle
//     map.addImage(sourceId, {
//       width: size,
//       height: size,
//       data: ctx.getImageData(0, 0, size, size).data,
//     });
//   }

//   // --- GEOJSON KAYNAĞI EKLEME ---
//   if (map.getSource(sourceId)) {
//     (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(pointGeoJson);
//     return;
//   }

//   map.addSource(sourceId, {
//     type: 'geojson',
//     data: pointGeoJson,
//   });

//   // --- LAYER EKLEME ---
//   map.addLayer({
//     id: sourceId,
//     type: 'symbol',
//     source: sourceId,
//     layout: {
//       'icon-image': sourceId,
//       'icon-size': 0.04, // ikon boyutu (isteğe göre ayarlanabilir)
//       'icon-anchor': 'center',
//     },
//   });
// }


export async function ShowLocationPoint(polygon: PolygonGeoJson, map: maplibregl.Map ): Promise<void> {
  if (!polygon.properties?.iconSource || !polygon.properties.iconSource.startsWith("<svg")) return;
    
  const positionCenter = getPolygonCenter(polygon);

  const uniqName = `_${positionCenter[0]}_${positionCenter[1]}}`;
  const sourceId = `_svg_marker_${uniqName}`;
  const imageId = `${sourceId}_img`;
 
  const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(polygon.properties.iconSource);
 
  const img = new Image();
  img.src = svgDataUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => reject(e);
  });
 
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = "white"
  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);
 
  if (!map.hasImage(imageId)) {
    map.addImage(imageId, {
      width: size,
      height: size,
      data: ctx.getImageData(0, 0, size, size).data,
    });
  }
 
  const point: GeoJSON.Feature<GeoJSON.Point> = {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: positionCenter },
    properties: {},
  };

  map.addSource(sourceId, { type: 'geojson', data: point });

  map.addLayer({
    id: sourceId,
    type: 'symbol',
    source: sourceId,
    layout: {
      'icon-image': imageId,
      'icon-size': 0.5,
      'icon-anchor': 'bottom',
      'icon-allow-overlap': true,
    },
  });
}



function getPolygonCenter(poly: PolygonGeoJson): [number, number] {
  if (poly.geometry.coordinates[0].length > 5 && poly.properties.entrance != null) {
    const ent = poly.properties.entrance.geometry.coordinates;
    return [ent[0], ent[1]];
  }
  const ring = poly.geometry.coordinates[0]; // outer ring
  let x = 0,
    y = 0;

  ring.forEach(([lon, lat]) => {
    x += lon;
    y += lat;
  });

  return [x / ring.length, y / ring.length];
}


function getFirstModelLayer(map: maplibregl.Map) {
  const layers = map.getStyle().layers;
  const logoLayers = layers?.filter((l) => l.id.startsWith('_model_'));
  return logoLayers?.length ? logoLayers[0].id : undefined;
}

function getFirstLogoLayer(map: maplibregl.Map) {
  const layers = map.getStyle().layers;
  const logoLayers = layers?.filter((l) => l.id.startsWith('_logo'));
  return logoLayers?.length ? logoLayers[0].id : undefined;
}