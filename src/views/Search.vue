<template>
  <view class="container">
    <Loader v-if="store.state.loading" />
    <nb-container v-else>
      <nb-header
        :style="{ backgroundColor: 'rgb(201, 76, 77)' }"
        androidStatusBarColor="rgb(201, 76, 77)"
        iosBarStyle="light-content"
      >
        <nb-left />
        <nb-body>
          <nb-title :style="{ color: '#fff' }">Search for ligands</nb-title>
        </nb-body>

        <nb-right v-if="store.state.isEnrolledAsync">
          <Logout :navigation="navigation" />
        </nb-right>
      </nb-header>

      <SearchBar :navigation="navigation" />
    </nb-container>
  </view>
</template>

<script>
import { Dimensions, Platform } from "react-native";
import SearchBar from "../components/SeachBar.vue";
import Logout from "../components/Logout.vue";
import store from "../store";
import Loader from "../components/Loader.vue";

export default {
  components: {
    SearchBar,
    Logout,
    Loader,
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  data() {
    return {
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
};
</script>

<style>
.container {
  flex: 1;
}
</style>
