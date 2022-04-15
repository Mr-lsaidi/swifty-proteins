<template>
  <nb-container>
    <nb-header
      :style="{ backgroundColor: 'rgb(201, 76, 77)' }"
      androidStatusBarColor="rgb(201, 76, 77)"
      iosBarStyle="light-content"
    >
    <nb-left />
      <nb-body>
        <nb-title :style="{ color: '#fff' }">Search for ligands</nb-title>
      </nb-body>

      <nb-right>
         <Logout :navigation="navigation"/>
      </nb-right>
    </nb-header>

    <SearchBar :navigation="navigation"/>
  </nb-container>
</template>

<script>
import { Dimensions, Platform } from "react-native";
import SearchBar from "../components/SeachBar.vue";
import Logout from '../components/Logout.vue'

export default {
  components: {
    SearchBar,
    Logout
  },
  props: {
    navigation: {
      type: Object,
    },
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
  
};
</script>

<style></style>
