import React, { useEffect } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl, { Marker } from 'maplibre-gl';
import { useAppDispatch } from '../redux/hooks';
import { setBearing, setMap } from '../redux/reducers/mapSlice';
import throttle from 'lodash/throttle';

const CENTER_LNG = Number(import.meta.env.VITE_CENTER_LNG);
const CENTER_LAT = Number(import.meta.env.VITE_CENTER_LAT);
const ZOOM = Number(import.meta.env.VITE_ZOOM);
const MIN_ZOOM = Number(import.meta.env.VITE_MIN_ZOOM);
const MAX_ZOOM = Number(import.meta.env.VITE_MAX_ZOOM);

export default function Map(): React.JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const map = new maplibregl.Map({
      container: 'map',
      style: {
        version: 8,
        name: 'Raster tiles',
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: ['https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 20, // tile kaynağı için
          },
        },
        layers: [
          {
            id: 'background',
            type: 'background',
            paint: { 'background-color': '#ffffff' },
          },
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
          },
        ],
      },
      center: [CENTER_LNG, CENTER_LAT],
      zoom: ZOOM,
      // minZoom: MIN_ZOOM,
      // maxZoom: MAX_ZOOM,
      pitch: 40,
      bearing: 122,
      canvasContextAttributes: { antialias: true },
      maxBounds: [
        [32.55, 37.94], // southwest [lng, lat]
        [32.57, 37.95], // northeast [lng, lat]
      ],
    });

    map.on('load', () => {
      dispatch(setMap(map));
    });

    // throttle sürekli state set etmek yerine 100ms de bir set eder
    const updateBearing = throttle(() => {
      dispatch(setBearing(map.getBearing()));
    }, 100);
 
    if (import.meta.env.VITE_CURRENT_LNG != undefined ||  import.meta.env.VITE_CURRENT_LAT!= undefined){
      new Marker({ color: "#ff0000" }).setLngLat([import.meta.env.VITE_CURRENT_LNG, import.meta.env.VITE_CURRENT_LAT]).addTo(map);
    }

    dispatch(setBearing(map.getBearing()));
    map.on('rotate', updateBearing);

    return () => {
      map.off('rotate', updateBearing);
      map.remove();
    };
  }, [dispatch]);

  return <div id="map" className="size-full rounded-2xl shdaow border-1"></div>;
}
