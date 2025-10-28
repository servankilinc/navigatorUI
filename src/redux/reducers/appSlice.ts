import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Floor from '../../models/Floor';
import { Position } from 'geojson';

interface StateUI {
  isEntrancePointAdded: boolean;
  currentFloor: Floor | undefined;
  startLocaltion?: string;
  targetLocaltion?: string;
  isWatcherEnable: boolean;
  currentLocation?: Position | undefined;
}

const initialState: StateUI = {
  isEntrancePointAdded: true,
  currentFloor: undefined,
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
    setIsWatcherEnable: (state, action: PayloadAction<boolean>) => {
      state.isWatcherEnable = action.payload;
    },
    setCurrentLocation: (state, action: PayloadAction<Position>) => {
      state.currentLocation = action.payload;
    },
  },
});

export const { setEntranceAdded, setCurrentFloor, setStartLocation, setTargetLocation, setIsWatcherEnable, setCurrentLocation } = appSlice.actions;

export default appSlice.reducer;
