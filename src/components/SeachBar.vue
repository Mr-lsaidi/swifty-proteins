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
      </nb-item>
      <nb-button transparent>
        <nb-text>Search</nb-text>
      </nb-button>
    </nb-header>
    <flat-list :data="results">
      <SearchList
        render-prop-fn="renderItem"
        :item="args.item.key"
        :navigation="navigation"
      />
    </flat-list>
  </nb-container>
</template>

<script>
import ligands from "../../assets/ligands";
import SearchList from "./SearchList.vue";
import store from "../store";

export default {
  components: {
    SearchList,
  },
  props: {
    navigation: {
      type: Object,
    },
  },
  data() {
    return {
      ligands,
      no_match: {
        value: false,
        message: "",
      },
      input: "",
      search_loading: false,
    };
  },
  computed: {
    results() {
      const data = store.state.ligands;
      return data;
    },
    loading() {
      const data = store.state.loading;
      return data;
    },
  },
  watch: {
    input(val, oldVal) {
      if (val) {
        console.log(val);
        store.commit("FELTER_LIGANDS", val)
        // .then(res=>{

        // })
        //     this.loading = true;
        //     this.no_match.value = false;
        //     this.filter(val.toUpperCase())
        //       .then((res) => {
        //         this.results = res;
        //         this.search_loading = false;
        //       })
        //       .catch((err) => {
        //         this.results = [];
        //         this.no_match = {
        //           value: true,
        //           message: `no resultes match '${val}'`,
        //         };
        //         this.search_loading = false;
        //       });
      }
    },
    // search_loading(val) {
    //   console.log(val);
    // },
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
