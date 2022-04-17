<template>
  <nb-container>
    <nb-header
      :style="{ backgroundColor: 'rgb(201, 76, 77)' }"
      androidStatusBarColor="rgb(201, 76, 77)"
      iosBarStyle="light-content"
    >
      <nb-left>
        <nb-button
          transparent
          :onPress="() => this.props.navigation.navigate('Search')"
        >
          <nb-icon
            name="arrow-back"
            class="text-color-white"
            :style="{ color: '#fff' }"
          />
        </nb-button>
      </nb-left>
      <nb-body>
        <nb-title :style="{ color: '#fff' }">Display module</nb-title>
      </nb-body>
      <nb-right v-if="store.state.isEnrolledAsync">
        <Logout :navigation="navigation" />
      </nb-right>
    </nb-header>
    <OrbitControlsView :style="{ flex: 1 }" :camera="camera">
      <GLView :style="{ flex: 2 }" :onContextCreate="_onGLContextCreate" />
    </OrbitControlsView>
  </nb-container>
</template>

<script>
import * as THREE from "three";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import OrbitControlsView from "expo-three-orbit-controls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { Dimensions, Platform } from "react-native";
import Logout from "../components/Logout.vue";
import store from "../store";

export default {
  components: {
    GLView,
    Logout,
    OrbitControlsView,
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  mounted() {
    console.log(this.navigation.getParam("data"));
  },
  data() {
    return {
      camera: null,
      store,
      stylesObj: {
        logoContainerStyle: {
          marginTop: Dimensions.get("window").height / 8,
        },
        logoStyle: {
          left: Platform.OS === "android" ? 40 : 50,
          top: Platform.OS === "android" ? 35 : 60,
        },
        btnContainer: {
          backgroundColor: "#6faf98",
          alignSelf: "center",
        },
      },
    };
  },
  methods: {
    handleChange(state) {
      log;
    },
    async _onGLContextCreate(gl) {
      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
      const sceneColor = 0x6ad6f0;

      // Create a WebGLRenderer without a DOM element
      const renderer = new Renderer({ gl });
      renderer.setSize(width, height);
      renderer.setClearColor(sceneColor);

      const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
      camera.position.set(2, 5, 5);


      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(sceneColor, 1, 10000);
      scene.add(new THREE.GridHelper(10, 10));

      const ambientLight = new THREE.AmbientLight(0x101010);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xffffff, 2, 1000, 1);
      pointLight.position.set(0, 200, 200);
      scene.add(pointLight);

      const spotLight = new THREE.SpotLight(0xffffff, 0.5);
      spotLight.position.set(0, 500, 100);
      spotLight.lookAt(scene.position);
      scene.add(spotLight);

      const sphereGeometry = new THREE.SphereGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x0fff0f });
      let cube = new THREE.Mesh(sphereGeometry, material);
      scene.add(cube);

      camera.lookAt(cube.position);

      function update() {
        cube.rotation.y += 0.05;
        cube.rotation.x += 0.025;
      }

      // Setup an animation loop
      const render = () => {
       requestAnimationFrame(render);
        update();
        renderer.render(scene, camera);

        // ref.current.getControls()?.update();
        gl.endFrameEXP();
      };
      render();
      this.camera = camera
      // // 1. Scene
      // var scene = new THREE.Scene();
      // scene.background = new THREE.Color(0x050505);

      // // 2. Camera
      // const camera = new THREE.PerspectiveCamera(
      //   75,
      //   gl.drawingBufferWidth / gl.drawingBufferHeight,
      //   0.1,
      //   1000
      // );
      // this.camera = camera;
      // const ambientLight = new THREE.DirectionalLight(0x050505, 0.9);
      // ambientLight.position.copy(camera.position);
      // scene.add(ambientLight);

      // // 3. Renderer
      // const renderer = new Renderer({ gl });
      // renderer.setClearColor("#000");
      // renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

      // const root = new THREE.Group();
      // scene.add(root);

      // const geometry = new THREE.BoxGeometry();
      // const sphereGeometry = new THREE.SphereGeometry();
      // const material = new THREE.MeshBasicMaterial({ color: 0x0fff0f });
      // let object = new THREE.Mesh(sphereGeometry, material);
      // const position = new THREE.Vector3();
      // position.x = 0.1;
      // position.y = 0.1;
      // position.z = 0.1;
      // object.position.copy(position);
      // root.add(object);

      // const material2 = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      // let object2 = new THREE.Mesh(geometry, material2);
      // const position2 = new THREE.Vector3();
      // position2.x = 0.5;
      // position2.y = 1.2;
      // position2.z = 0.9;
      // object2.position.copy(position2);

      // root.add(object2);

      // const controls = new OrbitControls(camera, renderer.domElement);
      // camera.position.z = 5;

      // const animate = () => {
      //   requestAnimationFrame(animate);
      //   ambientLight.position.set(
      //     camera.position.x,
      //     camera.position.y,
      //     camera.position.z
      //   );
      //   renderer.render(scene, camera);
      //   gl.endFrameEXP();
      // };
      // animate();
    },
  },
};
</script>

<style></style>
