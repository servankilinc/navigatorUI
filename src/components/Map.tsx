import React, { useEffect } from 'react';
// import { Map as MapLibreMap } from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setMap } from '../redux/reducers/mapSlice';

export default function Map(): React.JSX.Element {
  const dispatch = useAppDispatch();

  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);
  const polygonList = useAppSelector((state) => state.storageReducer.polygons);
  const map = useAppSelector((state) => state.mapReducer.map);

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
            maxzoom: 21, // tile kaynağı için
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
      center: [32.483570, 37.875672],
      zoom: 19.5,
      minZoom: 19, // zoom in (yakınlaşma) sınırı
      maxZoom: 20, // zoom out (uzaklaşma) sınırı
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

    return () => map.remove();
  }, []);

  useEffect(() => {
    if (currentFloor != null && map != null && polygonList.length > 0) {
    }
  }, []);

  return <div id="map" style={{ width: '100%', height: '90vh' }}></div>;
}
