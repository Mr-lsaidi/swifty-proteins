<template>
  <view class="container">
    <view class="box" :style="{ transform: [{ rotate: '45deg' }] }">
      <view class="container">
        <Swing :size="48" color="rgb(201, 76, 77)" />
      </view>
    </view>
  </view>
</template>

<script>
import { Swing } from "react-native-animated-spinkit";
export default {
  name: "loader",
  components: {
    Swing,
  },
};
</script>

<style>
.flex-row {
  flex-direction: row;
}
.container {
  flex: 1;
  justify-content: center;
  align-items: center;
}
.box {
  position: absolute;
  width: 80;
  height: 80;
  align-items: center;
  justify-content: center;
}
.small-box {
  background-color: white;
  height: 30;
  width: 30;
}
</style>
