import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import maplibregl from 'maplibre-gl';

interface StateUI {
  map: maplibregl.Map | undefined;
  bearing: number;
}

const initialState: StateUI = {
  map: undefined,
  bearing: 0
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMap: (state, action: PayloadAction<any>) => {
      state.map = action.payload;
    },
    setBearing: (state, action) => {
      state.bearing = action.payload;
    },
  },
});

export const { setMap, setBearing } = mapSlice.actions;

export default mapSlice.reducer;
