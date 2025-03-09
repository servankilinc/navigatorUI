import { Position } from "geojson"

export default interface Solid {
  type: String,
  features: solidFeature[]
}

export interface solidFeature {
  type:  String,
  geometry: {
    type: String,
    coordinates: Position[][]
  },
  properties: {
    id: String,
    floor: Number,
    name: String,
    popupContent: String,
    base_height: Number,
    height: Number,
    color: String,
  }
}
