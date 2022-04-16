<template>
  <view class="container">
    <Loader v-if="store.state.loading" />
    <nb-container v-else>
      <status-bar :barStyle="'light-content'"></status-bar>
      <image-background :source="launchScreenBg" class="imageContainer">
        <view class="logoContainer" :style="stylesObj.logoContainerStyle">
        </view>
        <view v-if="store.state.isEnrolledAsync" :style="{ marginBottom: 80 }">
          <nb-button :style="stylesObj.btnContainer" :onPress="onAuth">
            <nb-text> Authentication </nb-text>
            <nb-icon active name="finger-print-outline" />
          </nb-button>
        </view>
        <view v-else :style="{ marginBottom: 80 }">
          <nb-button :style="stylesObj.btnContainer" :onPress="success">
            <nb-text> Lets Go! </nb-text>
          </nb-button>
        </view>
      </image-background>
    </nb-container>
  </view>
</template>

<script>
import { Dimensions, Platform, Alert } from "react-native";
import launchScreenBg from "../../assets/bg.jpeg";
import * as LocalAuthentication from "expo-local-authentication";
import Loader from "../components/Loader.vue";
import store from "../store";

export default {
  components: { Loader },
  props: {
    navigation: {
      type: Object,
    },
  },
  data() {
    return {
      store,
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
  async created() {
    store.state.navigation = this.navigation;
    store.state.compatible = await LocalAuthentication.hasHardwareAsync();

    if (!store.state.isEnrolledAsync) {
      //if the Enrolled found not found go to the Search page directly
      this.success();
    }

    if (!store.state.compatible) {
      Alert.alert("Your phone not supported", "😃", [
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
            duration: 2000,
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
            duration: 2000,
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
      this.navigation.navigate("Search");
    },
  },
};
</script>

<style>
.container {
  flex: 1;
}
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
