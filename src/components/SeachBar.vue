<template>
  <nb-container :style="{ backgroundColor: '#fff' }">
    <nb-header
      searchBar
      rounded
      :style="{ backgroundColor: 'rgb(201, 76, 77)' }"
    >
      <nb-item>
        <nb-icon active name="search" />
        <nb-input placeholder="Search" v-model="input" />
        <Chase v-if="search_loading" :size="36" color="rgb(201, 76, 77)" />
      </nb-item>
      <nb-button transparent>
        <nb-text>Search</nb-text>
      </nb-button>
    </nb-header>
    <nb-content padder>
      <SearchList :results="results" :no_match="no_match" :navigation="navigation"/>
    </nb-content>
  </nb-container>
</template>

<script>
import ligands from "../../assets/ligands";
import SearchList from "./SearchList.vue";
import { Chase } from "react-native-animated-spinkit";

export default {
  components: {
    SearchList,
    Chase,
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  data() {
    return {
      ligands,
      results: [],
      no_match: {
        value: false,
        message: "",
      },
      input: "",
      search_loading: false,
    };
  },
  computed:{
    // results(){
    //   return this.ligands.sort()
    // }
  },
  watch: {
    input(val, oldVal) {
      if (val) {
        this.search_loading = true;
        this.no_match.value = false;
        this.filter(val.toUpperCase())
          .then((res) => {
            this.results = res;

            this.search_loading = false;
          })
          .catch((err) => {
            this.results = [];
            this.no_match = {
              value: true,
              message: `no resultes match '${val}'`,
            };
            this.search_loading = false;
          });
      }
    },
    search_loading(val) {
      console.log(val);
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
