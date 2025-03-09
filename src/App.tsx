import "./App.css";
import { useEffect } from "react";
import { Col, Row, Stack } from "react-bootstrap";
import NavigationController from "./components/NavigationController";
import AlertSuccess from "./components/alerts/AlertSuccess";
import AlertError from "./components/alerts/AlertError";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import Map from "./components/Map";
import AdvancedPointGeoJson from "./models/Features/AdvancedPointGeoJson";
import EntrancePointGeoJson from "./models/Features/EntrancePointGeoJson";
import Floor from "./models/Floor";
import Graph from "./models/Graph";
import LineStringGeoJson from "./models/Features/LineStringGeoJson";
import PolygonGeoJson from "./models/Features/PolygonGeoJson";
import { setAdvancedPointList, setEntrancePointList, setFloorList, setGraphList, setPathList, setPolygonList, setSolidFeatures} from "./redux/reducers/storageSlice";
import { showAlertError, showAlertSuccess } from "./redux/reducers/alertSlice";
import { setCurrentFloor } from "./redux/reducers/appSlice";
import { DesignGraph } from "./services/graphService";
import Solid from "./models/Solid";
import Floors from "./components/Floors";

function App() {
  const dispatch = useAppDispatch();

  const currentFloor = useAppSelector((state) => state.appReducer.currentFloor);

  useEffect(() => {
    FetchData();
  }, []);

  async function FetchData() {
    try {
      const res_advancedPoint = await fetch("http://localhost:5000/api/advancedPoint");
      const res_entrancePoint = await fetch("http://localhost:5000/api/entrancePoint");
      const res_floor = await fetch("http://localhost:5000/api/floor");
      const res_graph = await fetch("http://localhost:5000/api/graph");
      const res_path = await fetch("http://localhost:5000/api/path");
      const res_polygon = await fetch("http://localhost:5000/api/polygon");
      const res_solid = await fetch("http://localhost:5000/api/solid");
      

      const data_advancedPoint: AdvancedPointGeoJson[] = await res_advancedPoint.json();
      const data_entrancePoint: EntrancePointGeoJson[] = await res_entrancePoint.json();
      const data_floor: Floor[] = await res_floor.json();
      const data_graph: Graph[] = await res_graph.json();
      const data_path: LineStringGeoJson[] = await res_path.json();
      const data_polygon: PolygonGeoJson[] = await res_polygon.json();
      const data_solid: Solid[] = await res_solid.json();

      dispatch(setAdvancedPointList(data_advancedPoint));
      dispatch(setEntrancePointList(data_entrancePoint));
      dispatch(setFloorList(data_floor));
      dispatch(setGraphList(data_graph));
      dispatch(setPathList(data_path));
      dispatch(setPolygonList(data_polygon));
      dispatch(setSolidFeatures(data_solid[0].features));

      dispatch(showAlertSuccess({ message: "Veriler başarıyal getirildi." }));

      dispatch(setCurrentFloor(data_floor.some((f) => f.index == 0) ? data_floor.find((f) => f.index == 0)! : data_floor[0]!));

      // Design Graph for algorithims
      DesignGraph();
    }
    catch (error) {
      dispatch(showAlertError({ message: "Veriler getirilirken hata oluştu." }));
    }
  }
  return (
    <>
      <Row>
        <Col lg={9}>{currentFloor != null && <Map />}</Col>
        <Col lg={3}>
          <Stack gap={4}>
            <Floors />
            <NavigationController />
          </Stack>
        </Col>
      </Row>
      <AlertSuccess />
      <AlertError />
    </>
  );
}

export default App;
