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
      <OrbitControlsView
        :key="store.state.orientation"
        :style="{ flex: 1 }"
        :camera="camera"
      >
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
// import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

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
    await this.loadPdb(this.navigation.getParam("data") || "0e5");
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
      const sceneColor = 0x5353535;

      this.scene = new THREE.Scene();

      // Create a WebGLRenderer without a DOM element
      this.renderer = new Renderer({ gl });
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(sceneColor);

      this.camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
      this.camera.position.set(5.0, 5.0, 14.0);
      // this.camera.position.set(5, 5, 5);

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
          group.matrixWorld.invert(invMatrixWorld);
          groupBox.applyMatrix4(invMatrixWorld);
          groupBox.getCenter(optionalTarget);
          return optionalTarget;
        };
      })();

      var group = this.buildGroup();
      var center = computeGroupCenter(group);
      console.log("center is", center);
      // var axis = new THREE.AxesHelper(7.5);
      // this.scene.add(axis);
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
        ambientLight.position.set(
          this.camera.position.x,
          this.camera.position.y,
          this.camera.position.z
        );

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
          // console.log(string);
          return {
            parsedPdb: parsePdb(string),
            connections: [...(string.match(/^CONECT.*/gm) || [])].map(
              (connection) => {
                const connectionIds = connection
                  .replace(/(CONECT| +)/g, " ")
                  .trim()
                  .split(" ");
                return connectionIds.map((num) => parseInt(num, 10));
              }
            ),
          };
          s;
        })
        .then(({ parsedPdb, connections }) => {
          const atomsMap = {};

          parsedPdb.atoms.forEach(function addToMap(atom) {
            atomsMap[atom.serial] = atom;
          });

          this.parsedPdb = {
            atoms: atomsMap,
            connections,
          };
          store.state.loading = false;
          // console.log("-->", this.parsedPdb);
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
      const atoms = this.parsedPdb.atoms;

      for (let [key, value] of Object.entries(atoms)) {
        var color = COLORS[Math.floor(Math.random() * COLORS.length)];
        var mesh = new THREE.Mesh(
          new THREE.SphereBufferGeometry(0.3),
          new THREE.MeshPhongMaterial({ color: color, shininess: 10 })
        );
        mesh.position.set(value.x, value.y, value.z);
        group.add(mesh);
      }

      for (let i = 0; i < this.parsedPdb.connections.length; i++) {
        // console.log(`-----${i}-----`);
        for (let j = 0; j < this.parsedPdb.connections[i].length; j++) {
          const element = this.parsedPdb.connections[i][j];
          const nextElement = this.parsedPdb.connections[i][j + 1];

          if (nextElement) {
            // console.log(`connect ${element} with ${nextElement}`);
            const start = new THREE.Vector3();
            const end = new THREE.Vector3();

            // console.log("DEBUG", { nextAtom: atoms[nextElement], nextElement });
            start.x = atoms[element].x;
            start.y = atoms[element].y;
            start.z = atoms[element].z;
            end.x = atoms[nextElement].x;
            end.y = atoms[nextElement].y;
            end.z = atoms[nextElement].z;

            const geoBox = new THREE.BoxGeometry(
              0.05,
              0.05,
              start.distanceTo(end)
            );

            const cylinder = new THREE.Mesh(
              geoBox,
              new THREE.MeshPhongMaterial({ color: 0xffffff })
            );
            cylinder.position.copy(start);
            cylinder.position.lerp(end, 0.5);
            cylinder.lookAt(end);
            cylinder.geometry.parameters.depth = 20;
            group.add(cylinder);
          }
        }
      }
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
