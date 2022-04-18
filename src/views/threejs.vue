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

          <nb-button>
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
import Loader from "../components/Loader.vue";
import * as THREE from "three";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import OrbitControlsView from "expo-three-orbit-controls";
import parsePdb from "parse-pdb";
import { Dimensions, Platform, Alert } from "react-native";
import Logout from "../components/Logout.vue";
import store from "../store";

export default {
  components: {
    GLView,
    Logout,
    OrbitControlsView,
    Loader,
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  async mounted() {
    console.log("Search for: ", this.navigation.getParam("data"));
    await this.loadPdb(this.navigation.getParam("data") || "co2");
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

      this.scene = new THREE.Scene();

      // Create a WebGLRenderer without a DOM element
      this.renderer = new Renderer({ gl });
      this.renderer.setSize(width, height);
      // renderer.setClearColor(sceneColor);

      this.camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
      // this.camera.position.set(14.0, 14.0, 14.0);
      this.camera.position.set(2, 5, 5);

      const ambientLight = new THREE.DirectionalLight(0xffffff, 0.9);
      ambientLight.position.copy(this.camera.position);
      this.scene.add(ambientLight);

      var computeGroupCenter = (function() {
        var childBox = new THREE.Box3();
        var groupBox = new THREE.Box3();
        var invMatrixWorld = new THREE.Matrix4();
        return function(group, optionalTarget) {
          if (!optionalTarget) optionalTarget = new THREE.Vector3();
          group.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              if (!child.geometry.boundingBox) {
                child.geometry.computeBoundingBox();
                childBox.copy(child.geometry.boundingBox);
                child.updateMatrixWorld(true);
                childBox.applyMatrix4(child.matrixWorld);
                groupBox.min.min(childBox.min);
                groupBox.max.max(childBox.max);
              }
            }
          });
          // All computations are in world space
          // But the group might not be in world space
          group.matrixWorld.getInverse(invMatrixWorld);
          groupBox.applyMatrix4(invMatrixWorld);
          groupBox.getCenter(optionalTarget);
          return optionalTarget;
        };
      })();

      var group = this.buildGroup(100);
      var center = computeGroupCenter(group);
      console.log("center is", center);
      var axis = new THREE.AxesHelper(7.5);
      this.scene.add(axis);
      this.scene.add(group);
      group.position.copy(center).negate(); // move group in the opposite way

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
        gl.endFrameEXP();
      };
      render();
    },
    loadPdb(pdb) {
      store.state.loading = true;
      store
        .dispatch("GET_LIGAND", pdb)
        .then((string) => {
          return {
            parsedPdb: parsePdb(string),
            connections: [...string.match(/^CONECT.*/gm)].map((connection) => {
              const connectionIds = connection
                .replace(/(CONECT| +)/g, " ")
                .trim()
                .split(" ");
              return connectionIds.map((num) => parseInt(num, 10));
            }),
          };
        })
        .then(({ parsedPdb, connections }) => {
          const atomsMap = new Map();

          parsedPdb.atoms.forEach(function addToMap(atom) {
            atomsMap.set(atom.serial, atom);
          });

          this.parsedPdb = {
            atoms: atomsMap,
            connections,
          };
          store.state.loading = false;
          console.log("-->", this.parsedPdb);
        })
        .catch((err) => {
          console.log(err);
          store.state.loading = false;
          Alert.alert("Lignd not found", "😃", [
            {
              text: "Cancel",
            },
          ]);
        });
    },
    buildGroup() {
      const COLORS = [0xffffff, 0xd40000, 0x0084ff];
      const group = new THREE.Group();


      for (let [key, value] of this.parsedPdb.atoms) {
        var color = COLORS[Math.floor(Math.random() * COLORS.length)];
        var mesh = new THREE.Mesh(
          new THREE.SphereBufferGeometry(0.5),
          new THREE.MeshPhongMaterial({ color: color, shininess: 50 })
        );
        mesh.position.set(value.x, value.y, value.z);
        group.add(mesh);
      }

      this.parsedPdb.connections.forEach(element => {
        console.log('->',element);
      }); 
      
      // const start = new THREE.Vector3();
      // const end = new THREE.Vector3();

      // start.x = Atoms;

      // start.multiplyScalar(
      //   width > height ? width / height + 1 : height / width + 1
      // );
      // end.multiplyScalar(
      //   width > height ? width / height + 1 : height / width + 1
      // );
      // const geoBox = new THREE.BoxGeometry(
      //   0.5,
      //   0.5,
      //   start.distanceTo(end)
      // );
      // const cylinder = new THREE.Mesh(
      //   geoBox,
      //   new THREE.MeshPhongMaterial({ color: 0xffffff })
      // );
      // cylinder.position.copy(start);
      // cylinder.position.lerp(end, 0.5);
      // cylinder.lookAt(end);
      // this.scene.add(cylinder);

      return group;
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
