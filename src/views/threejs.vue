<template>
  <view class="container">
    <Loader v-if="store.state.loading" />
    <nb-container v-else>
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
        <GLView :style="{ flex: 1 }" :onContextCreate="_onGLContextCreate" />
      </OrbitControlsView>

      <nb-footer>
        <nb-footer-tab>
          <nb-button :onPress="zoomOut">
            <nb-icon name="remove" />
          </nb-button>

          <nb-button :onPress="zoomIn">
            <nb-icon name="add" />
          </nb-button>

          <nb-button :onPress="loadMolecule">
            <nb-icon name="share-social-outline" />
          </nb-button>

          <nb-button :onPress="animate">
            <nb-icon name="sync-outline" />
          </nb-button>
        </nb-footer-tab>
      </nb-footer>
    </nb-container>
  </view>
</template>

<script>
import Loader from '../components/Loader.vue'
import * as THREE from "three";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import OrbitControlsView from "expo-three-orbit-controls";
import parsePdb from "parse-pdb";
import { Dimensions, Platform, View } from "react-native";
import Logout from "../components/Logout.vue";
import store from "../store";

export default {
  components: {
    GLView,
    Logout,
    OrbitControlsView,
    View,
    Loader
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
      camera: undefined,
      renderer: undefined,
      controls: undefined,
      sence: undefined,
      animated: false,
      parsedPdb: {},
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
    zoomIn() {
      console.log(this.camera.fov);
      this.camera.fov -= 5;
      this.camera.updateProjectionMatrix();
    },
    zoomOut() {
      this.camera.fov += 5;
      this.camera.updateProjectionMatrix();
    },
    animate() {
      this.animated = !this.animated;
    },
    async _onGLContextCreate(gl) {
      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
      const sceneColor = 0x6ad6f0;

      // Create a WebGLRenderer without a DOM element
      this.renderer = new Renderer({ gl });
      this.renderer.setSize(width, height);
      // renderer.setClearColor(sceneColor);

      this.camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
      this.camera.position.set(2, 5, 5);

      this.scene = new THREE.Scene();

      const sphereGeometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x0fff0f });
      let cube = new THREE.Mesh(sphereGeometry, material);
      this.scene.add(cube);

      // Setup an animation loop
      const animated_update = () => {
        if (this.animated) {
          this.scene.rotation.x += 0.02;
          this.scene.rotation.y += 0.02;
        }
      };

      const render = () => {
        requestAnimationFrame(render);

        this.renderer.render(this.scene, this.camera);
        animated_update();
        // ref.current.getControls()?.update();
        gl.endFrameEXP();
      };
      render();
    },
    loadMolecule() {
      store.state.loading = true;
      store
        .dispatch("GET_LIGAND", "co2")
        .then((string) => {
          const connections = [...string.match(/^CONECT.*/gm)].map(
            (connection) => {
              const connectionIds = connection
                .replace(/(CONECT| +)/g, " ")
                .trim()
                .split(" ");

              return connectionIds.map((num) => parseInt(num, 10));
            }
          );

          this.parsedPdb = parsePdb(string);
          this.parsedPdb.connections = connections;
          console.log("-->", this.parsedPdb);
          store.state.loading = false;
        })
        .catch((err) => {
          console.log(err);
          store.state.loading = false;
        });
    },
  },
};
</script>

<style>
.container {
  flex: 1;
}
.content-wrapper {
  background-color: #fff;
  padding: 20;
}
.view-wrapper-1 {
  flex-direction: row;
  justify-content: space-between;
}
</style>
