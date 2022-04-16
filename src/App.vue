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

const StackNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Search,
    DisplayModules,
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
