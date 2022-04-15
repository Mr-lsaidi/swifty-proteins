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
    navigation(){
      return store.state.navigation
    }
  },
  async created() {
    if (AppState._eventHandlers.change.size == 0) {
      AppState.addEventListener("change", (nextAppState) => {
        this.appState = nextAppState;
        if (nextAppState == "background") {
          console.info("App has come to the foreground!");
          store.state.loading = false
          if (this.navigation){
            console.info("------- back to home page ---------");
            this.navigation.navigate("Home");
          }
        }
      });
    }
  },
};
</script>
