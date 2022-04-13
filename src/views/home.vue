<template>
  <nb-container>
    <status-bar :barStyle="'light-content'"></status-bar>
    <image-background :source="launchScreenBg" class="imageContainer">
      <view class="logoContainer" :style="stylesObj.logoContainerStyle"> </view>
      <view :style="{ marginBottom: 80 }">
        <nb-button :style="stylesObj.btnContainer" :onPress="onAuth">
          <nb-text> Lets Go! </nb-text>
        </nb-button>
      </view>
    </image-background>
  </nb-container>
</template>

<script>
import { Dimensions, Platform, Alert } from "react-native";
import launchScreenBg from "../../assets/bg.jpeg";
import * as LocalAuthentication from "expo-local-authentication";
import store from "../store";

export default {
  components: {},
  props: {
    navigation: {
      type: Object,
    },
  },
  data() {
    return {
      launchScreenBg,
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
  computed:{
    loading() {
      return store.state.loading
    }
  },
  created() {
    if (!store.state.compatible) {
      Alert.alert("You phone not supported", "😃", [
        {
          text: "Cancel",
        },
      ]);
    }
  },
  methods: {
    onAuth() {
      const auth = LocalAuthentication.authenticateAsync({
        promptMessage: "Authentication",
        fallbackLabel: "Error Password",
      });
      auth
        .then((result) => {
          if (result.error) throw new Error(result.error || result.message);
          return result;
        })
        .then(() => {
          store.isAutenticated = true;
          store.dispatch("DISPLAY_TOAST", {
            text: "authentication succeeded",
            duration: 3000,
            position: "bottom",
            textStyle: { color: "black" },
            buttonText: "Okay",
            buttonTextStyle: { color: "#008000" },
            buttonStyle: { backgroundColor: "#e0e0e0" },
            type: "success",
          });
          this.success();
        })
        .catch((error) => {
          console.info("catch: ", error.message);
          store.dispatch("DISPLAY_TOAST", {
            text: "You must be authenticated to use the application!",
            duration: 3000,
            position: "bottom",
            textStyle: { color: "black" },
            buttonText: "Okay",
            buttonTextStyle: { color: "white" },
            buttonStyle: { backgroundColor: "black" },
            type: "warning",
          });
        });
    },
    success() {
      this.loading = true;
      store
        .dispatch("FETCH_LIGANDS")
        .then(() => {
          this.loading = false;
          this.navigation.navigate("Search");
        })
        .catch((err) => {
          console.log(err);
          Alert.alert("There is no ligands setted", "😰", [
            {
              text: "Cancel",
            },
          ]);
        });
    },
  },
};
</script>

<style>
.imageContainer {
  flex: 1;
}
.text-color-primary {
  color: blue;
  font-family: Roboto;
}
.logoContainer {
  flex: 1;
  margin-bottom: 30;
}
.logo {
  position: absolute;
  width: 280;
  height: 100;
}
.text-container {
  align-items: center;
  margin-bottom: 50;
  background-color: transparent;
}
.text-color-white {
  color: white;
}
.button-container {
  background-color: #6faf98;
  align-self: center;
}
</style>
