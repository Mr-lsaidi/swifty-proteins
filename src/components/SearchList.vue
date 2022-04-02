<template>
  <view>
    <nb-text v-if="no_match.value">
      {{ no_match.message }}
    </nb-text>
    <scroll-view v-else :style="{ width: '100%', height: 'auto' }">
      <nb-list-item v-for="(elem, index) in results" :key="index">
        <touchable-opacity
          class="flex-container"
          :on-press="() => selectLigand(elem)"
          :style="{
            backgroundColor: '#ffffff90',
            width: '100%',
            borderRadius: 50,
          }"
        >
          <view class="border">
            <nb-body>
              <nb-text>
                {{ elem }}
              </nb-text>
            </nb-body>
          </view>
        </touchable-opacity>
      </nb-list-item>
    </scroll-view>
  </view>
</template>

<script>
export default {
  props: {
    results: {
      type: Array,
    },
    no_match: {
      type: Object,
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
