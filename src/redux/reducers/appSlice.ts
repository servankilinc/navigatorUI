import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Floor from '../../models/Floor';
import { Position } from 'geojson';
import { LayerTypesEnum } from '@/models/UIModels/LayerTypesEnum';

interface StateUI {
  isEntrancePointAdded: boolean;
  currentFloor: Floor | undefined;
  startLocaltion?: string;
  targetLocaltion?: string;
  layerType: LayerTypesEnum;
  isWatcherEnable: boolean;
  currentLocation?: Position | undefined;
}

const initialState: StateUI = {
  isEntrancePointAdded: true,
  currentFloor: undefined,
  layerType : LayerTypesEnum.UcBoyut,
  isWatcherEnable: false,
};

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: {
    setEntranceAdded: (state, action: PayloadAction<boolean>) => {
      state.isEntrancePointAdded = action.payload;
    },
    setCurrentFloor: (state, action: PayloadAction<Floor>) => {
      state.currentFloor = action.payload;
    },
    setStartLocation: (state, action: PayloadAction<string>) => {
      state.startLocaltion = action.payload;
    },
    setTargetLocation: (state, action: PayloadAction<string>) => {
      state.targetLocaltion = action.payload;
    },
    setLayerType: (state, action: PayloadAction<LayerTypesEnum>) => {
      state.layerType = action.payload;
    },
    setIsWatcherEnable: (state, action: PayloadAction<boolean>) => {
      state.isWatcherEnable = action.payload;
    },
    setCurrentLocation: (state, action: PayloadAction<Position>) => {
      state.currentLocation = action.payload;
    },
  },
});

export const { setEntranceAdded, setCurrentFloor, setStartLocation, setTargetLocation, setLayerType, setIsWatcherEnable, setCurrentLocation } = appSlice.actions;

export default appSlice.reducer;
