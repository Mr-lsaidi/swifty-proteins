<template>
  <setup></setup>
</template>

<script>
import Setup from "./src/boot/setup.vue";
import * as LocalAuthentication from "expo-local-authentication";
import store from "./src/store";

export default {
  components: { Setup },
  async created() {
    store.state.compatible = await LocalAuthentication.hasHardwareAsync()
  },
};
</script>
