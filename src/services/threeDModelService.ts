import ThreeDModel from '@/models/ThreeDModel';
import maplibregl, { CustomLayerInterface } from 'maplibre-gl';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function ShowGLTFModel(props: ThreeDModel, map: maplibregl.Map) {
  const modelAltitude = 0;
  
  // rotate bilgilerini radyan cinsinden tutuyoruz x değerini 90derece yapmak için pi/2  yapıyorum
  const modelRotate = [Math.PI / 2, props.rotateY, props.rotateZ];

  const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat({ lat: props.origin[0], lng: props.origin[1] }, modelAltitude);

  const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * props.scaleRate,
  };
  if(map.getLayer(props.id)) return;
  
  const customLayer: CustomLayerInterface = {
    id: props.id,
    type: 'custom',
    renderingMode: '3d',
    onAdd(map, gl) {
      const camera = new THREE.Camera();
      const scene = new THREE.Scene();

      // create two three.js lights to illuminate the model
      const directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, -70, 100).normalize();
      scene.add(directionalLight);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      scene.add(directionalLight2);

      const loader = new GLTFLoader();
      loader.load(`${import.meta.env.VITE_API_URL}/api/threeDModel${props.source}`, (gltf) => scene.add(gltf.scene));

      const renderer = new THREE.WebGLRenderer({
        canvas: map.getCanvas(),
        context: gl,
        antialias: true,
      });

      renderer.autoClear = false;

      Object.assign(this, { camera, scene, renderer, map });
    },
    render(gl: WebGLRenderingContext, args) {
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
  map.addLayer(customLayer);
}
