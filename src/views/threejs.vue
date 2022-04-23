<template>
  <view :style="{ flex: 1 }">
    <Wave
        :size="50"
        :style="{ alignSelf: 'center', position: 'absolute', top: '45%' }"
        color="rgb(201, 76, 77)"
        v-if="renderLoader"
      />
    <OrbitControlsView
      :key="store.state.orientation"
      :style="{ flex: 1 }"
      :camera="store.state.camera"
    >
      <GLView :style="{ flex: 1 }" :onContextCreate="_onGLContextCreate" />
    </OrbitControlsView>
  </view>
</template>

<script>
import Loader from "../components/Loader.vue";
import * as THREE from "three";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import OrbitControlsView from "expo-three-orbit-controls";
import Logout from "../components/Logout.vue";
import store from "../store";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { Wave } from "react-native-animated-spinkit";

export default {
  components: {
    GLView,
    Logout,
    OrbitControlsView,
    Loader,
    Wave
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  data() {
    return {
      loading: true,
      store,
      raycaster: undefined,
      renderLoader: false
    };
  },
  created() {
    console.log("init");
    this.renderLoader = true;

    store.state.parsedPdb = this.navigation.getParam("data");
    // this.loading = true;
    const raycaster = new THREE.Raycaster();
    this.beforeRender();
  },
  methods: {
    // Setup an animation loop
    animated_update() {
      if (store.state.animation) {
        store.state.scene.rotation.x += 0.02;
        store.state.scene.rotation.y += 0.02;
      }
    },
    beforeRender() {
      let i = 0;
      let j = 0;
      if (store.state.group && store.state.scene) {
        i = 0;
        j = 0;
        store.state.group.traverse((object) => {
          if (!object.isMesh) return;

          store.state.scene.remove(object);

          object.geometry.dispose();
          if (object.material.isMaterial) {
            this.cleanMaterial(object.material);
            j += 1;
          } else {
            // an array of materials
            for (const material of object.material)
              this.cleanMaterial(material);
            j += 1;
          }

          object.geometry = undefined;
          object = undefined;
          i += 1;
        });
        store.state.scene.remove(store.state.group);
        store.state.group = undefined;
        console.log(`group 1 clean ${i} mesh`);
        console.log(`group 1 clean ${j} material`);
      }
      if (store.state.labelsGroup && store.state.scene) {
        i = 0;
        j = 0;
        store.state.labelsGroup.traverse((object) => {
          if (!object.isMesh) return;

          store.state.scene.remove(object);
          object.geometry.dispose();
          if (object.material.isMaterial) {
            this.cleanMaterial(object.material);
            j += 1;
          } else {
            // an array of materials
            for (const material of object.material)
              this.cleanMaterial(material);
            j += 1;
          }

          object.geometry = undefined;
          object = undefined;
          i += 1;
        });
        store.state.scene.remove(store.state.labelsGroup);
        store.state.labelsGroup = undefined;
        console.log(`group 2 clean ${i} mesh`);
        console.log(`group 2 clean ${j} material`);
      }
    },
    cleanMaterial(material) {
      const i = 0;
      // dispose textures
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === "object" && "minFilter" in value) {
          console.log("dispose texture! " + key);
          value.dispose();
        }
      }
      material.dispose();
      material = undefined;
    },
    async _onGLContextCreate(gl) {
      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

      store.state.scene = new THREE.Scene();

      // Create a WebGLRenderer without a DOM element
      store.state.renderer = new Renderer({ gl });
      store.state.renderer.setSize(width, height);
      store.state.renderer.setClearColor("#FFFFFF");

      store.state.camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        2,
        80
      );
      store.state.camera.position.set(5.0, 5.0, 10.0);
      store.state.camera.lookAt(0, 0, 0);

      store.state.group = await this.buildGroup();

      store.state.sceneLight = new THREE.DirectionalLight(0xffffff, 0.9);
      store.state.sceneLight.position.copy(store.state.camera.position);
      store.state.scene.add(store.state.sceneLight);

      store.state.scene.add(store.state.group);
      store.state.scene.add(store.state.labelsGroup);

      //  this.loading = false;
      console.log("end init");
      this.renderLoader = false;

      // var axis = new THREE.AxesHelper(7.5);
      // store.state.group.add(axis);

      const render = () => {
        requestAnimationFrame(render);

        store.state.sceneLight.position.set(
          store.state.camera.position.x,
          store.state.camera.position.y,
          store.state.camera.position.z
        );

        this.animated_update();
        store.state.renderer.render(store.state.scene, store.state.camera);

        gl.endFrameEXP();
      };
      render();
    },
    async buildGroup() {
      this.beforeRender();
      // const COLORS = [0xffffff, 0xd40000, 0x0084ff];
      const group = new THREE.Group();
      store.state.labelsGroup = new THREE.Group();
      try {
        this.drowAtoms(group);
        store.state.labelsGroup.visible = false;
        this.drowConnections(group);
        return group;
      } catch (err) {
        return err;
      }
    },
    drowAtoms(group) {
      const atoms = store.state.parsedPdb.atoms;
      for (let [key, value] of Object.entries(atoms)) {
        // var color = COLORS[Math.floor(Math.random() * COLORS.length)];
        var mesh = new THREE.Mesh(
          new THREE.SphereBufferGeometry(0.3),
          new THREE.MeshPhongMaterial({ color: 0xd40000, shininess: 1 })
        );
        mesh.position.set(value.x, value.y, value.z);

        this.createText(value.name, value.x, value.y, value.z);

        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        group.add(mesh);
      }
    },
    createText(text, x, y, z) {
      const height = 0.01,
        size = 0.1,
        curveSegments = 0.01,
        bevelThickness = 0.01,
        bevelSize = 0.01;
      var textGeo = new TextGeometry(text, {
        font: store.state.mech_font,

        size: size,
        height: height,
        curveSegments: curveSegments,

        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: true,
      });

      var textMat = new THREE.MeshPhongMaterial({ color: "#FFFF00" });

      const textMesh = new THREE.Mesh(textGeo, textMat);
      textMesh.position.set(x, y, z + 0.4);
      store.state.labelsGroup.add(textMesh);
    },
    drowConnections(group) {
      const atoms = store.state.parsedPdb.atoms;
      for (let i = 0; i < store.state.parsedPdb.connections.length; i++) {
        // console.log(`-----${i}-----`);
        for (let j = 0; j < store.state.parsedPdb.connections[i].length; j++) {
          const element = store.state.parsedPdb.connections[i][j];
          const nextElement = store.state.parsedPdb.connections[i][j + 1];

          if (nextElement) {
            const start = new THREE.Vector3();
            const end = new THREE.Vector3();

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
              new THREE.MeshPhongMaterial({ color: "#607466" })
            );
            cylinder.position.copy(start);
            cylinder.position.lerp(end, 0.5);
            cylinder.lookAt(end);
            cylinder.geometry.parameters.depth = 20;
            group.add(cylinder);
          }
        }
      }
    },
  },
};
</script>
