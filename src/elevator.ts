import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  MeshNormalMaterial,
  PointLight,
  Color,
  SphereGeometry,
  TextureLoader,
  EquirectangularReflectionMapping,
  AmbientLight,
  AxesHelper,
  GridHelper,
  CameraHelper,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min";
import Stats from "three/examples/jsm/libs/stats.module";
// import { GLTFLoader } from "three/examples/jsm/sta";
import elevatorGltf from "./assets/scene.gltf";
import house from "./assets/house.webp";
import fullBg from "./assets/fullbackground.hdr";

class Elevator {
  stats: Stats;
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  controls: OrbitControls;
  gltfLoader: GLTFLoader;
  cube?: Mesh<BoxGeometry, MeshNormalMaterial>;
  sphere?: Mesh<SphereGeometry, MeshBasicMaterial>;

  constructor() {
    this.scene = new Scene();

    this.stats = new Stats();
    this.camera = new PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);

    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.gltfLoader = new GLTFLoader();
  }

  init() {
    document.getElementById("app")?.appendChild(this.renderer.domElement);
    this.loadGltf();
    this.initLight();
    this.initHelper();
    this.initControll();
    this.initGUI();
    this.initStats();

    window.addEventListener("resize", () => this.onResize());
  }

  initContent() {
    let sphereGeometry = new SphereGeometry(16, 50, 50);
    sphereGeometry.scale(16, 16, -16);
    let texture = new TextureLoader().load(house);
    let sphereMaterial = new MeshBasicMaterial({ map: texture });
    this.sphere = new Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(this.sphere);
  }

  initRGBELoader() {
    new RGBELoader().load(fullBg, (texture) => {
      texture.mapping = EquirectangularReflectionMapping;
      this.scene.background = texture;
      this.scene.environment = texture;
    });
  }

  loadGltf() {
    this.gltfLoader.load(elevatorGltf, (gltf) => {
      gltf.scene.scale.set(44, 44, 44);
      this.scene.add(gltf.scene);
      this.render();
    });
  }

  initLight() {
    const light = new AmbientLight(0xffffff); // soft white light
    this.scene.add(light);
    this.render();
  }

  initControll() {
    this.controls.enableZoom = false;
    this.controls.addEventListener("change", () => this.render());
  }

  initHelper() {
    const cameraHelper = new CameraHelper(this.camera);
    this.scene.add(cameraHelper);
    const gridHelper = new GridHelper(10, 10);
    this.scene.add(gridHelper);
    const axesHelper = new AxesHelper(5);
    this.scene.add(axesHelper);
    this.render();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.render;
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  initStats() {
    document.getElementById("app")?.appendChild(this.stats.dom);
  }
  initGUI() {
    const gui = new GUI();
    // gui.add(params, "Cube");
    // gui.add(params, "Equirectangular");
    // gui.add(params, "Refraction").onChange(function (value) {
    //   if (value) {
    //     textureEquirec.mapping = THREE.EquirectangularRefractionMapping;
    //     textureCube.mapping = THREE.CubeRefractionMapping;
    //   } else {
    //     textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
    //     textureCube.mapping = THREE.CubeReflectionMapping;
    //   }

    //   sphereMaterial.needsUpdate = true;
    // });
    gui.open();
  }

  render() {
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
  }
}

export default Elevator;
