<template>
  <view class="container">
    <app-loading v-if="!isAppReady"> </app-loading>
    <app v-if="isAppReady"></app>
  </view>
</template>

<script>
import Vue from "vue-native-core";
import { VueNativeBase } from "native-base";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import store from "../store";

import App from "../App.vue";

// registering all native-base components to the global scope of the Vue
Vue.use(VueNativeBase);

export default {
  components: { App, AppLoading },
  data() {
    return {
      isAppReady: false,
    };
  },
  created() {
    this.loadFonts();
    this.detectOrientation();
  },
  methods: {
    async loadFonts() {
      setTimeout(async () => {
        try {
          this.isAppReady = false;
          await Font.loadAsync({
            Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf"),
            ionicons: Ionicons.font["ionicons"],
          });
          this.isAppReady = true;
        } catch (error) {
          console.log("some error occured", error);
          this.isAppReady = true;
        }
      }, 1000);
    },
    async detectOrientation() {
      ///init orientation
      if (Dimensions.get("window").width < Dimensions.get("window").height) {
        store.state.orientation = "PORTRAIT";
        store.state.currOrientation = "PORTRAIT";
      } else {
        store.state.orientation = "LANDSCAPE";
        store.state.currOrientation = "LANDSCAPE";
      }
      // set listneron orientation
      Dimensions.addEventListener("change", ({ window: { width, height } }) => {
        if (width < height) {
          if (store.state.orientation !== "PORTRAIT")
            store.state.orientation = "PORTRAIT";
        } else {
          if (store.state.orientation !== "LANDSCAPE")
            store.state.orientation = "LANDSCAPE";
        }
      });
    },
  },
};
</script>

<style>
.container {
  flex: 1;
}
</style>
