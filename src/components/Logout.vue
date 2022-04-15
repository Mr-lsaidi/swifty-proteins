<template>
  <nb-button transparent :onPress="() => logout()">
    <nb-icon name="power" class="text-color-white" :style="{ color: '#fff' }" />
  </nb-button>
</template>

<script>
import { Alert } from "react-native";
export default {
  props: {
    navigation: {
      type: Object,
    },
  },
  methods: {
    logout() {
      Alert.alert(
        "Confirmation",
        "if you logout you migth going to go throw the login step",
        [
          {
            text: "Logout",
            onPress: () => this.navigation.navigate("Home"),
          },
          {
            text: "Cancel"
          },
        ]
      );
    },
  },
};
</script>
