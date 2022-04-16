<template>
  <setup></setup>
</template>

<script>
import Setup from "./src/boot/setup.vue";
import store from "./src/store";
import { LogBox, AppState } from "react-native";
LogBox.ignoreLogs(['The global "__expo" and "Expo" objects will']);

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
    if (AppState._eventHandlers.change.size == 0) { // for dev
      AppState.addEventListener("change", (nextAppState) => {
        this.appState = nextAppState;
        if (nextAppState == "background") {
          console.info("App has come to the foreground!");
          store.state.loading = false;
          if (this.navigation) {
            console.info("------- back to home page ---------");
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
