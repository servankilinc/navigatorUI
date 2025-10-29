import React, { useEffect } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { useAppDispatch } from '../redux/hooks';
import { setBearing, setMap } from '../redux/reducers/mapSlice';
import throttle from 'lodash/throttle';

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
      center: [import.meta.env.VITE_CENTER_LNG, import.meta.env.VITE_CENTER_LAT],
      zoom: import.meta.env.VITE_ZOOM,
      minZoom: import.meta.env.VITE_MIN_ZOOM,
      maxZoom: import.meta.env.VITE_MAX_ZOOM,
      pitch: 40,
      bearing: 122,
      // maxBounds: [
      //   [32.55, 37.94], // southwest [lng, lat]
      //   [32.57, 37.95], // northeast [lng, lat]
      // ],
    });

    map.on('load', () => {
      dispatch(setMap(map));
    });
    
    const updateBearing = throttle(() => {
      dispatch(setBearing(map.getBearing()));
    }, 100);

    dispatch(setBearing(map.getBearing()));
    map.on('rotate', updateBearing);

    
    return () => {
      map.off('rotate', updateBearing);
      map.remove();
    };
  }, [dispatch]);

  return <div id="map" className="size-full rounded-2xl shdaow border-1"></div>;
}
