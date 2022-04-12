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
  },
  mutations: {
    SET_AUTH(state, data) {
      console.log("mutation");
    },
  },
  actions: {
    FETCH_LIGANDS(context) {
      return new Promise((resolve, reject) => {
        if (Object.entries(ligands).length) resolve(ligands);
        else resolve({ error: "Ther is no ligands setted" });
      });
    },
    DISPLAY_TOAST(context, params) {
      Toast.show(params);
    },
  },
});

export default store;
