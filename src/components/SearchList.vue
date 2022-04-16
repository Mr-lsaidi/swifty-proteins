<template>
  <view>
    <nb-list-item v-if="item.key != 'not_found'">
      <touchable-opacity
        class="flex-container"
        :on-press="() => selectLigand(item.key)"
        :style="{
          backgroundColor: '#ffffff90',
          width: '100%',
          borderRadius: 50,
        }"
      >
        <view class="border">
          <nb-body>
            <nb-text>
              {{ item.key }}
            </nb-text>
          </nb-body>
        </view>
      </touchable-opacity>
    </nb-list-item>
    <nb-list-item v-else>
      <view class="border">
        <nb-body>
          <nb-text>
            {{ item.not_found }}
          </nb-text>
        </nb-body>
      </view>
    </nb-list-item>
  </view>
</template>

<script>
import store from "../store";
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    navigation: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      store,
    };
  },
  methods: {
    selectLigand(elem) {
      console.log("click", elem);
      store.state.loading = true;
      // store.dispatch("GET_LIGAND", elem)
      setTimeout(() => {
        store.state.loading = false;
        this.navigation.navigate("DisplayModules", {
          data: elem,
        });
        
      }, 2000);
    },
  },
};
</script>

<style>
.body-icon-color {
  color: #999;
}
</style>
