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
  createMaterialTopTabNavigator
} from "vue-native-router";
import { Root } from "native-base";
import HomeScreen from "./views/home.vue";
import DisplayModules from "./views/threejs.vue";
import Search from "./views/Search.vue";

import { LogBox } from "react-native";
LogBox.ignoreLogs(["Native splash screen is already hidden."]);
LogBox.ignoreLogs(["Warning: ..."]);

const StackNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Search,
    DisplayModules,
    // User: TabNavigator,
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
