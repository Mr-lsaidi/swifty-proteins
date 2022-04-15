<template>
  <root>
    <app-navigation></app-navigation>
  </root>
</template>

<script>
import {
  createAppContainer,
  createStackNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from "vue-native-router";
import { Root } from "native-base";
import HomeScreen from "./views/home.vue";
import DisplayModules from "./views/threejs.vue";
import Search from "./views/Search.vue";
import Loader from "../src/components/Loader.vue";
import store from "./store";

const StackNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Search,
    DisplayModules,
    Loader
  },
  {
    headerMode: "none",
  }
);

const AppNavigation = createAppContainer(StackNavigator);

export default {
  components: { Root, AppNavigation },
};
</script>
