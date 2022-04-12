<template>
  <nb-container>
    <status-bar :barStyle="'light-content'"></status-bar>
    <image-background :source="launchScreenBg" class="imageContainer">
      <view class="logoContainer" :style="stylesObj.logoContainerStyle">
        <image-background
          :source="launchscreenLogo"
          class="logo"
          :style="stylesObj.logoStyle"
        />
      </view>
      <view class="text-container">
        <nb-h3 :style="{ marginBottom: 8 }" class="text-color-white"
          >App To ShowCase</nb-h3
        >
        <nb-h3 class="text-color-white">NativeBase Components</nb-h3>
      </view>
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
import launchScreenBg from "../../assets/launchscreen-bg.png";
import launchscreenLogo from "../../assets/logo-kitchen-sink.png";
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
      launchscreenLogo,
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
  methods: {
    onAuth() {
      if (store.state.compatible) {
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
              text:
                "Wrong password! you canot use the APP without authentication",
              duration: 5000,
              position: "bottom",
              textStyle: { color: "black" },
              buttonText: "Okay",
              buttonTextStyle: { color: "#008000" },
              buttonStyle: { backgroundColor: "#e0e0e0" },
              type: "warning",
            });
            store
              .dispatch("FETCH_LIGANDS")
              .then((res) => {
                this.navigation.navigate("Search");
              })
              .catch((err) => {
                Alert.alert(err, "😰", [
                  {
                    text: "Cancel",
                  },
                ]);
              });
          })
          .catch((error) => {
            console.info("catch: ", error.message);
            store.dispatch("DISPLAY_TOAST", {
              text:
                "Wrong password! you canot use the APP without authentication",
              duration: 5000,
              position: "bottom",
              textStyle: { color: "black" },
              buttonText: "Okay",
              buttonTextStyle: { color: "#008000" },
              buttonStyle: { backgroundColor: "#e0e0e0" },
              type: "warning",
            });
          });
      } else {
        Alert.alert("You phone not supported", "😃", [
          {
            text: "Cancel",
          },
        ]);
      }
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
