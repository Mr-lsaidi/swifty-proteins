<template>
  <view class="container">
    <Loader v-if="store.state.loading" />
    <nb-container v-else>
      <nb-header
        :style="{ backgroundColor: 'rgb(201, 76, 77)' }"
        androidStatusBarColor="rgb(201, 76, 77)"
        iosBarStyle="light-content"
      >
        <nb-left>
          <nb-button
            transparent
            :onPress="() => this.props.navigation.navigate('Search')"
          >
            <nb-icon
              name="arrow-back"
              class="text-color-white"
              :style="{ color: '#fff' }"
            />
          </nb-button>
        </nb-left>
        <nb-body>
          <nb-title :style="{ color: '#fff' }">Display module</nb-title>
        </nb-body>
        <nb-right v-if="store.state.isEnrolledAsync">
          <Logout :navigation="navigation" />
        </nb-right>
      </nb-header>

      <view :style="{ flex: 1 }">
        <Display3d :navigation="navigation" />
        <nb-fab
          :active="isFabIconActive"
          :onPress="handleFabIconPress"
          direction="up"
          position="bottomRight"
        >
          <nb-icon-nb name="expand"></nb-icon-nb>

          <nb-button
            :style="{ backgroundColor: '#3B5998' }"
            :disabled="store.state.camera && store.state.camera.fov >= 180"
            :onPress="zoomOut"
          >
            <nb-icon-nb name="remove"></nb-icon-nb>
          </nb-button>
          <nb-button
            :style="{ backgroundColor: '#3B5998' }"
            :disabled="store.state.camera && store.state.camera.fov <= 5"
            :onPress="zoomIn"
          >
            <nb-icon-nb name="add"></nb-icon-nb>
          </nb-button>
        </nb-fab>
      </view>

      <nb-footer>
        <nb-footer-tab>
          <nb-button :onPress="atomsInfo">
            <nb-icon name="information-circle" />
          </nb-button>
          <nb-button :onPress="animate">
            <nb-icon name="sync-outline" />
          </nb-button>
          <nb-button :onPress="share">
            <nb-icon name="share-social-outline" />
          </nb-button>
          <nb-button :onPress="showLable">
            <nb-icon name="pricetag" />
          </nb-button>
        </nb-footer-tab>
      </nb-footer>
    </nb-container>
  </view>
</template>

<script>
const componentDidMount = () => {
  console.log(refs);
  // this.refs.viewShot.capture().then((uri) => {
  //   console.log("do something with ", uri);
  // });
};
import Loader from "../components/Loader.vue";
import { Dimensions, Platform, Alert } from "react-native";
import Logout from "../components/Logout.vue";
import store from "../store";
import Display3d from "./threejs.vue";
import * as MediaLibrary from "expo-media-library";
import { captureScreen } from "react-native-view-shot";
import * as Sharing from "expo-sharing";

export default {
  components: {
    Logout,
    Loader,
    Display3d,
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  data() {
    return {
      componentDidMount,
      isFabIconActive: false,
      showLabels: false,
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
  methods: {
    atomsInfo() {
      Alert.alert(
        "Protine Details :",
        `
        Atoms :  ${Object.keys(store.state.parsedPdb.atoms).length}
        Connections :  ${
          Object.keys(store.state.parsedPdb.connections).length
        }`,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    },
    handleFabIconPress() {
      this.isFabIconActive = !this.isFabIconActive;
    },
    zoomIn() {
      console.log(store.state.camera.fov);

      store.state.camera.fov -= 5;
      store.state.camera.updateProjectionMatrix();
    },
    zoomOut() {
      console.log(store.state.camera.fov);
      store.state.camera.fov += 5;
      store.state.camera.updateProjectionMatrix();
    },
    animate() {
      store.state.animation = !store.state.animation;
    },
    async share() {
      console.log("share");
      try {
        let uri = await captureScreen({
          format: "png",
          quality: 0.8,
        });
        await Sharing.shareAsync(uri, { dialogTitle: "Share this image" });
        let result = await MediaLibrary.requestPermissionsAsync(true);
        if (result.status === "granted") {
          let r = await MediaLibrary.saveToLibraryAsync(uri);
          console.log(r);
        }
      } catch (e) {
        console.log(e);
      }
    },
    showLable() {
      this.showLabels = !this.showLabels;
      console.log("lable", this.showLabels);
      store.state.labelsGroup.visible = this.showLabels;
    },
  },
};
</script>

<style>
.container {
  flex: 1;
}
.content-wrapper {
  background-color: #fff;
  padding: 20;
}
.view-wrapper-1 {
  flex-direction: row;
  justify-content: space-between;
}
</style>
