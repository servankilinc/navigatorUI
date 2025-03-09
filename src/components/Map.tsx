import React, { useEffect, useState } from "react";
// import { Map as MapLibreMap } from '@vis.gl/react-maplibre';
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from 'maplibre-gl';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setMap } from "../redux/reducers/mapSlice";
import { ShowSolid } from "../services/polygonService";
import Solid from "../models/Solid";

export default function Map(): React.JSX.Element{

  const dispatch = useAppDispatch();

  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);
  const solid = useAppSelector((state) => state.storageReducer.solid);
  const map = useAppSelector((state) => state.mapReducer.map);
 

  useEffect(() => {
    const map = new maplibregl.Map({
      container: 'map',
      style: {
        // id: 'raster',
        version: 8,
        name: 'Raster tiles',
        center: [0, 0],
        zoom: 19,
        sources: {
            'raster-tiles': {
                'type': 'raster',
                'tiles': ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                'tileSize': 256,
                'minzoom': 0,
                'maxzoom': 19
            }
        },
        layers: [
            {
                'id': 'background',
                'type': 'background',
                'paint': {
                    'background-color': '#e0dfdf'
                }
            },
            {
                'id': 'simple-tiles',
                'type': 'raster',
                'source': 'raster-tiles'
            }
        ]
      },
      center: [33.087147, 39.091641],
      zoom: 19,
      pitch: 40,
      bearing: 20,
    });

    
    map.on('load', () => {
      // map.addSource('floorplan', {
      //   'type': 'geojson',
      //   'data': './building.geojson'
      // });

      // // map.removeLayer("floorplan")
      // map.addLayer({
      //   'id': 'room-extrusion',
      //   'type': 'fill-extrusion',
      //   'source': 'floorplan',
      //   'paint': {
      //     'fill-extrusion-color': ['get', 'color'],
      //     'fill-extrusion-height': ['get', 'height'],
      //     'fill-extrusion-base': ['get', 'base_height'],
      //     'fill-extrusion-opacity': 0.5
      //   }
      // });

      dispatch(setMap(map)); 
    });

    return () => map.remove();
  }, []);

  useEffect(() =>{
    if(currentFloor != null && map != null && solid != null && solid.features.length > 0){
      const featuresToShow = solid.features.filter((f) => f.properties.floor == currentFloor.index)
      const solidToShow: Solid = {
        type:"FeatureCollection",
        features: featuresToShow,
      };
      ShowSolid(solidToShow, map!);
    }
  }, [currentFloor, map, solid])

  return (
    <div id="map" style={{ width: '100%', height: '90vh' }}></div>
  );
}