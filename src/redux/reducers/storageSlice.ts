import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Floor from '../../models/Floor';
import Graph from '../../models/Graph';
import PolygonGeoJson from '../../models/Features/PolygonGeoJson';
import LineStringGeoJson from '../../models/Features/LineStringGeoJson';
import EntrancePointGeoJson from '../../models/Features/EntrancePointGeoJson';
import AdvancedPointGeoJson from '../../models/Features/AdvancedPointGeoJson';
import Route from '../../models/Route';
import Solid, { solidFeature } from '../../models/Solid';
import ThreeDModelPointGeoJson from '@/models/Features/ThreeDModelPointGeoJson';

interface StateUI {
  floorList: Floor[];
  graphList: Graph[];
  polygons: PolygonGeoJson[];
  paths: LineStringGeoJson[];
  routeList: Route[];
  entrancePoints: EntrancePointGeoJson[];
  advancedPoints: AdvancedPointGeoJson[];
  solid: Solid;
  threeDModels: ThreeDModelPointGeoJson[];
}

const initialState: StateUI = {
  floorList: [],
  graphList: [],
  polygons: [],
  paths: [],
  routeList: [],
  entrancePoints: [],
  advancedPoints: [],
  solid: {
    type: 'FeatureCollection',
    features: [],
  },
  threeDModels:[]
};

export const storageSlice = createSlice({
  name: 'storageSlice',
  initialState,
  reducers: {
    setFloorList: (state, action: PayloadAction<Floor[]>) => {
      state.floorList = [...action.payload];
      state.floorList.sort((a, b) => b.index - a.index);
    },
    setGraphList: (state, action: PayloadAction<Graph[]>) => {
      state.graphList = [...action.payload];
    },
    setPolygonList: (state, action: PayloadAction<PolygonGeoJson[]>) => {
      state.polygons = [...action.payload];
    },
    setPathList: (state, action: PayloadAction<LineStringGeoJson[]>) => {
      state.paths = [...action.payload];
    },
    setRouteList: (state, action: PayloadAction<Route[]>) => {
      state.routeList = [...action.payload];
    },
    setEntrancePointList: (state, action: PayloadAction<EntrancePointGeoJson[]>) => {
      state.entrancePoints = [...action.payload];
    },
    setAdvancedPointList: (state, action: PayloadAction<AdvancedPointGeoJson[]>) => {
      state.advancedPoints = [...action.payload];
    },
    setSolidFeatures: (state, action: PayloadAction<solidFeature[]>) => {
      state.solid.features = [...action.payload];
    },
    setRoutes: (state, action: PayloadAction<Route[]>) => {
      state.routeList = [...action.payload];
    },
    setThreeDModels: (state, action: PayloadAction<ThreeDModelPointGeoJson[]>) => {
      state.threeDModels = [...action.payload];
    },
    clearRoutes: (state) => {
      state.routeList = [];
    },
  },
});

export const { setFloorList, setGraphList, setPolygonList, setPathList, setRouteList, setEntrancePointList, setAdvancedPointList, setSolidFeatures, setThreeDModels, clearRoutes, setRoutes } =
  storageSlice.actions;

export default storageSlice.reducer;
