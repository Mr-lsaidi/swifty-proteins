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
import { Alert } from "react-native";
import parsePdb from "parse-pdb";
import Loader from "../components/Loader.vue";

export default {
  components: {
    Loader,
  },
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
      loading: true,
      store,
      parsedPdb: undefined,
    };
  },
  methods: {
    async selectLigand(elem) {
      console.log("click", elem);
      store.state.loading = true;
      store
        .dispatch("GET_LIGAND", elem)
        .then((string) => {
          // console.log(string);
          return {
            parsedPdb: parsePdb(string),
            connections: [...(string.match(/^CONECT.*/gm) || [])].map(
              (connection) => {
                const connectionIds = connection
                  .replace(/(CONECT| +)/g, " ")
                  .trim()
                  .split(" ");
                return connectionIds.map((num) => parseInt(num, 10));
              }
            ),
          };
        })
        .then(({ parsedPdb, connections }) => {
          const atomsMap = {};

          parsedPdb.atoms.forEach(function addToMap(atom) {
            atomsMap[atom.serial] = atom;
          });

          this.parsedPdb = {
            atoms: atomsMap,
            connections,
          };
          store.state.loading = false;
          this.navigation.navigate("DisplayModules", {
            data: this.parsedPdb,
          });
        })
        .catch((err) => {
          console.log(err);
          store.state.loading = false;
          Alert.alert("Lignd not found", "😃", [
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
.body-icon-color {
  color: #999;
}
</style>
