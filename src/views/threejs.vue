<template>
  <nb-container>
    <nb-header
      :style="{ backgroundColor: 'rgb(201, 76, 77)' }"
      androidStatusBarColor="rgb(201, 76, 77)"
      iosBarStyle="light-content"
    >
      <nb-left>
        <nb-button transparent :onPress="() => this.props.navigation.goBack()">
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
      <nb-right />
    </nb-header>
    <GLView :style="{ flex: 1 }" :onContextCreate="_onContextCreate()" />
  </nb-container>
</template>

<script>

class SphereMesh extends Mesh {
  constructor() {
    super(
      new SphereGeometry(0, 50, 20, 0, Math.PI * 2, 0, Math.PI * 2),
      new MeshStandardMaterial({
        color: 0xff0000,
      })
    );
  }
}

const sphere = new SphereMesh();
const camera = new PerspectiveCamera(100, 0.4, 0.01, 1000);

let cameraInitialPositionX = 0;
let cameraInitialPositionY = 2;
let cameraInitialPositionZ = 5;

import { Dimensions, Platform } from "react-native";
import * as React from "react";
import { View, TouchableWithoutFeedback, Text } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import {
  AmbientLight,
  SphereGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from "three";

export default {
  components: {},
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
    async _onContextCreate(gl) {
      // GL Parameter disruption
      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;

      // Renderer declaration and set properties
      const renderer = new Renderer({ gl });
      renderer.setSize(width, height);
      renderer.setClearColor("#fff");

      // Scene declaration, add a fog, and a grid helper to see axes dimensions
      const scene = new Scene();
      scene.fog = new Fog("#3A96C4", 1, 10000);
      scene.add(new GridHelper(10, 10));

      // Add all necessary lights
      const ambientLight = new AmbientLight(0x101010);
      scene.add(ambientLight);

      const pointLight = new PointLight(0xffffff, 2, 1000, 1);
      pointLight.position.set(0, 200, 200);
      scene.add(pointLight);

      const spotLight = new SpotLight(0xffffff, 0.5);
      spotLight.position.set(0, 500, 100);
      spotLight.lookAt(scene.position);
      scene.add(spotLight);

      // Add sphere object instance to our scene
      scene.add(sphere);

      // Set camera position and look to sphere
      camera.position.set(
        cameraInitialPositionX,
        cameraInitialPositionY,
        cameraInitialPositionZ
      );

      camera.lookAt(sphere.position);

      // Render function
      const render = () => {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      render();
    },
  },
};
</script>

<style></style>
