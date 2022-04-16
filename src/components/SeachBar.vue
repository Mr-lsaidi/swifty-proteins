<template>
  <nb-container :style="{ backgroundColor: '#fff' }">
    <nb-header
      searchBar
      rounded
      :style="{ backgroundColor: 'rgb(201, 76, 77)' }"
    >
      <nb-item >
        <nb-icon active name="search" />
        <nb-input placeholder="Search" v-model="input" />
        <Wave v-if='search_loading' :size="25" :style="{margin: 6}" color="rgb(201, 76, 77)" />
      </nb-item>
      <nb-button transparent>
        <nb-text>Search</nb-text>
      </nb-button>
    </nb-header>    
    <flat-list :data="results">
      <SearchList
        render-prop-fn="renderItem"
        :item="args.item"
        :navigation="navigation"
      />
    </flat-list>
  </nb-container>
</template>

<script>
import ligands from "../../assets/ligands";
import SearchList from "./SearchList.vue";
import store from "../store";
import { Wave } from "react-native-animated-spinkit";

export default {
  components: {
    SearchList,
    Wave
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  data() {
    return {
      store,
      ligands,
      no_match: {
        value: false,
        message: "",
      },
      input: "",
    };
  },
  computed: {
    results() {
      const data = store.state.filtred_ligands;
      return data;
    },
    search_loading() {
      const data = store.state.search_loading;
      return data;
    },
  },
  watch: {
    input(val, oldVal) {
      if (val) {
        store.state.search_loading = true;
        setTimeout(() => {
          store
            .dispatch("FELTER_LIGANDS", val.toUpperCase())
            .then(() => {
              store.state.search_loading = false;
            })
            .catch((err) => {
              store.state.search_loading = false;
            });
        }, 100);
      } else {
        store.commit("FILRE_LIGEANDS_LIGEANDS");
      }
    },
  },
  methods: {
    search() {
      console.log(this.ligands.length);
    },
    async filter(val) {
      return new Promise(async (resolve, reject) => {
        let res = [];
        await this.ligands.forEach((element) => {
          if (element.includes(val)) {
            res.push(element);
          }
        });
        if (res.length) resolve(res);
        else reject(null);
      });
    },
  },
};
</script>
