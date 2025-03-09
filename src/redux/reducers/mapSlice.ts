import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import maplibregl from 'maplibre-gl';
// import * as mLibre from '@vis.gl/react-maplibre';


interface StateUI {
  map: maplibregl.Map | undefined;
}

const initialState: StateUI = {
  map: undefined,
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMap: (state, action: PayloadAction<any>) => {
      state.map = action.payload;
    },
  },
});

export const { setMap } = mapSlice.actions;

export default mapSlice.reducer;
