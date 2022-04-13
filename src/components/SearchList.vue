<template>
  <view>
    <nb-list-item>
      <touchable-opacity
        class="flex-container"
        :on-press="() => selectLigand(item)"
        :style="{
          backgroundColor: '#ffffff90',
          width: '100%',
          borderRadius: 50,
        }"
      >
        <view class="border">
          <nb-body>
            <nb-text>
              {{ item }}
            </nb-text>
          </nb-body>
        </view>
      </touchable-opacity>
    </nb-list-item>
  </view>

</template>

<script>
export default {
  props: {
    item: {
      type: String,
    },
    navigation: {
      type: Object,
    },
  },
  data() {
    return {};
  },

  methods: {
    selectLigand(elem) {
      console.log("click", elem);
      this.navigation.navigate("DisplayModules", {
        data: elem,
      });
    },
  },
};
</script>

<style>
.body-icon-color {
  color: #999;
}
</style>
