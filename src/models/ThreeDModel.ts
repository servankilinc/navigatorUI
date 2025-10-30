export default interface ThreeDModel {
  id: string;
  source: string;
  origin: number[]; // lat, lng
  scaleRate: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
}
