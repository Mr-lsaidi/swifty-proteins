import Vue from "vue-native-core";
import Vuex from "vuex";
import ligands from "../../assets/ligands";
import { Toast } from "native-base";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isAutenticated: false,
    isCompatible: false,
    UserConectionCode: undefined,
    ligands: undefined,
    loading: false,
  },
  mutations: {
    SET_LIGEANDS(state, data) {
      state.ligands = data;
    },
    SET_LOADER(state, data) {
      state.loading = data;
    },
    FELTER_LIGANDS(state, value){
      state.ligands.map((element) => {
        console.log(element.key);
      });
    }
  },
  actions: {
    FETCH_LIGANDS(context) {
      return new Promise(async (resolve, reject) => {
        if (Object.entries(ligands).length) {
          console.log("resolve");
          const res = [];
          await ligands.map((ligand) => {
            res.push({ key: ligand });
          });
          context.commit("SET_LIGEANDS", res);
          resolve();
        } else {
          console.log("reject");
          reject();
        }
        reject();
      });
    },
    async FELTER_LIGANDS(context, val) {
      // return new Promise(async (resolve, reject) => {
      //   let res = [];
        // await context.state.ligands.forEach((element) => {
        //   console.log(element);
        //   if (element.includes(val)) {
        //     res.push(element);
        //   }
        // });
        
        // if (res.length) resolve(res);
        // else reject(null);
      // });
    },
    DISPLAY_TOAST(context, params) {
      Toast.show(params);
    },
  },
});

export default store;
