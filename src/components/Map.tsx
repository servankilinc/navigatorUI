import React, { useEffect } from "react";
// import { Map as MapLibreMap } from '@vis.gl/react-maplibre';
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from 'maplibre-gl';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setMap } from "../redux/reducers/mapSlice";
import { ShowLogo, ShowSolid } from "../services/polygonService";
import Solid from "../models/Solid";

export default function Map(): React.JSX.Element{

  const dispatch = useAppDispatch();

  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);
  const solid = useAppSelector((state) => state.storageReducer.solid);
  const polygonList = useAppSelector((state) => state.storageReducer.polygons);
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
                    'background-color': '#e6e6e6ff'
                }
            },
            {
                'id': 'simple-tiles',
                'type': 'raster',
                'source': 'raster-tiles'
            }
        ]
      },
      center: [32.561392, 37.944467],
      zoom: 19,
      pitch: 40,
      bearing: 20,
    });

    
    map.on('load', () => {
      dispatch(setMap(map)); 
    });

    return () => map.remove();
  }, []);

  // useEffect(() =>{
  //   if(currentFloor != null && map != null && solid != null && solid.features.length > 0){
  //     const featuresToShow = solid.features.filter((f) => f.properties.floor == currentFloor.index)
  //     const solidToShow: Solid = {
  //       type:"FeatureCollection",
  //       features: featuresToShow,
  //     };
  //     ShowSolid(solidToShow, map!);

  //     // logo test
  //     if(polygonList != null && polygonList.length >0 ){
     
  //         ShowLogo(polygonList[0], map); 
  //     }
  //   }
  // }, [currentFloor, map, solid])

  return (
    <div id="map" style={{ width: '100%', height: '90vh' }}></div>
  );
}