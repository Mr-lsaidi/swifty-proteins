<template>
  <Canvas>
    <pointLight :position="[10, 10, 10]" />
    <mesh>
      <sphereBufferGeometry />
     
    </mesh>
  </Canvas>
</template>

<script>
import { Canvas } from '@react-three/fiber'
import {
  pointLight,
  mesh,
  sphereBufferGeometry,
  meshStandardMaterial,
} from "react-three-fiber";

export default {
  components: {
    Canvas,
    pointLight,
    mesh,
    sphereBufferGeometry,
    meshStandardMaterial,
  },
  data: function() {
    return {};
  },
  created: function() {},
  mounted: function() {},
  methods: {},
};
</script>

<style></style>
