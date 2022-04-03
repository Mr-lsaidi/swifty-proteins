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
    <!-- <GLView :style="{ flex: 1 }" :onContextCreate="_onContextCreate()" /> -->
    <GLView :style="{ flex: 1 }" :onContextCreate="_onGLContextCreate" />
  </nb-container>
</template>

<script>
import Expo from "expo";
import React, { Component } from "react";
import * as THREE from "three";
import ExpoTHREE from "expo-three";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import { Dimensions, Platform } from "react-native";

export default {
  components: {
    GLView,
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
    async _onGLContextCreate(gl) {
      // 1. Scene
      var scene = new THREE.Scene();
      // 2. Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      // 3. Renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      camera.position.z = 5;

      //scene.add(cube);

      const animate = () => {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      animate();
    },
  },
};
</script>

<style></style>
