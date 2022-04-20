<template>
  <setup></setup>
</template>

<script>
import Setup from "./src/boot/setup.vue";
import store from "./src/store";
import { LogBox, AppState } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
LogBox.ignoreLogs(['The global "__expo" and "Expo" objects will', 'THREE.Quaternion: .inverse() has been renamed to invert().']);

export default {
  components: { Setup },
  computed: {
    appState() {
      return store.state.appState;
    },
    navigation() {
      return store.state.navigation;
    },
  },
  async created() {
    store.state.isEnrolledAsync = await LocalAuthentication.isEnrolledAsync();
    console.log("init check isEnrolledAsync -->", store.state.isEnrolledAsync);

    if (AppState._eventHandlers.change.size == 0) {
      // for dev
      AppState.addEventListener("change", async (state) => {
        this.appState = state;
        if (state == "background") {
          console.info("Application in the Background!\n");
        } else {
          console.info("------- back to the Application ---------\n");
          store.state.isEnrolledAsync = await LocalAuthentication.isEnrolledAsync();
          console.log(
            "recheck isEnrolledAsync -->",
            store.state.isEnrolledAsync
          );
          if (this.navigation) {
            store.state.isEnrolledAsync
              ? this.navigation.navigate("Home") //back to home page if the Enrolled found
              : this.navigation.navigate("Search"); //back to search page if the Enrolled not found
          }
        }
      });
    }
  },
};
</script>
