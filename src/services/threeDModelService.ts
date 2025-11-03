import ThreeDModelPointGeoJson from '@/models/Features/ThreeDModelPointGeoJson';
import maplibregl, { CustomLayerInterface } from 'maplibre-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

type supportdedTypes = 'gltf' | 'glb' | 'ply' | 'stl';

export function Show3DModel(model: ThreeDModelPointGeoJson, map: maplibregl.Map) {
  if (model.properties.source == null || model.properties.source.length < 2) return;
  if (model.properties.source.toLowerCase().trim().endsWith('ply')) {
    Show3DModelBase(model, map, 'ply');
  } else if (model.properties.source.toLowerCase().trim().endsWith('gltf') || model.properties.source.toLowerCase().trim().endsWith('glb')) {
    Show3DModelBase(model, map, 'gltf');
  } else if (model.properties.source.toLowerCase().trim().endsWith('stl')) {
    Show3DModelBase(model, map, 'stl');
  }
}

function Show3DModelBase(model: ThreeDModelPointGeoJson, map: maplibregl.Map, type: supportdedTypes) {
  const  layerId = `_model_${model.properties.id}`;

  const modelAltitude = 0;
  const modelRotate = [Math.PI / 2, model.properties.rotateY, model.properties.rotateZ];

  const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat({ lng: model.geometry.coordinates[0], lat: model.geometry.coordinates[1] }, modelAltitude);

  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * model.properties.scaleRate,
  };

  if (map.getLayer(layerId)) return;

  const customLayer: CustomLayerInterface = {
    id: layerId,
    type: 'custom',
    renderingMode: '3d',
    onAdd(map, gl) {
      const camera = new THREE.Camera();
      const scene = new THREE.Scene();

      // Işıklar
      // GÜN IŞIĞI ETKİSİ
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
      sunLight.position.set(100, 200, 400);
      scene.add(sunLight);

      const hemiLight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.5);
      hemiLight.position.set(0, 100, 0);
      scene.add(hemiLight);

      // ---- MODEL YÜKLEYİCİ ----
      const modelUrl = `${import.meta.env.VITE_API_URL}/api/threeDModel${model.properties.source}`;

      if (type === 'gltf') {
        const loader = new GLTFLoader();
        loader.load(modelUrl, (gltf) => scene.add(gltf.scene));
      } else if (type === 'ply') {
        const loader = new PLYLoader();
        loader.load(modelUrl, (geometry) => {
          geometry.computeVertexNormals();
          const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, flatShading: false });
          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);
        });
      } else if (type === 'stl') {
        const loader = new STLLoader();
        loader.load(modelUrl, (geometry) => {
          geometry.computeVertexNormals();
          const material = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.1, roughness: 0.5 });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          scene.add(mesh);
        });
      }

      // Renderer
      const renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });
      renderer.autoClear = false;

      Object.assign(this, { camera, scene, renderer, map });
    },

    render(gl: WebGLRenderingContext, args) {
      console.log(gl);
      const { camera, scene, renderer } = this as unknown as {
        camera: THREE.Camera;
        scene: THREE.Scene;
        renderer: THREE.WebGLRenderer;
      };

      const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0), modelTransform.rotateX);
      const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0), modelTransform.rotateY);
      const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1), modelTransform.rotateZ);

      const m = new THREE.Matrix4().fromArray(args.defaultProjectionData.mainMatrix);
      const l = new THREE.Matrix4()
        .makeTranslation(modelTransform.translateX, modelTransform.translateY, modelTransform.translateZ)
        .scale(new THREE.Vector3(modelTransform.scale, -modelTransform.scale, modelTransform.scale))
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

      camera.projectionMatrix = m.multiply(l);
      renderer.resetState();
      renderer.render(scene, camera);
      map.triggerRepaint();
    },
  };

  // solid ilk modeden yoksa ilk logodan önce eklensin
  const beforeLayer = getFirstLogoLayer(map);

  map.addLayer(customLayer, beforeLayer ?? undefined);
}


function getFirstLogoLayer(map: maplibregl.Map) {
  const layers = map.getStyle().layers;
  const logoLayers = layers?.filter((l) => l.id.startsWith('_logo'));
  return logoLayers?.length ? logoLayers[0].id : undefined;
}