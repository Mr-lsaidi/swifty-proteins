import Vue from "vue-native-core";
import Vuex from "vuex";
import ligands from "../../assets/ligands";
import { Toast } from "native-base";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    navigation: undefined,
    appState: undefined,
    isAutenticated: false,
    isCompatible: false,
    UserConectionCode: undefined,
    ligands: undefined,
    filtred_ligands: undefined,
    search_loading: false
  },
  mutations: {
    UPDATE_FILRE_LIGEANDS(state, data) {
      state.filtred_ligands = data;
    },
    FILRE_LIGEANDS_LIGEANDS(state) {
      state.filtred_ligands = state.ligands;
    },
    SET_LIGEANDS(state, data) {
      state.filtred_ligands = data;
      state.ligands = data;
    },
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
      });
    },
    async FELTER_LIGANDS(context, val) {
      return new Promise(async (resolve, reject) => {
        let res = [];
        await context.state.ligands.forEach((element) => {
          const key = element.key;
          if (key.includes(val)) {
            res.push({ key });
          }
        });
        if (res.length) {
          context.commit("UPDATE_FILRE_LIGEANDS", res);
          resolve();
        } else {
          context.commit("UPDATE_FILRE_LIGEANDS", [
            { key: "not_found", not_found: `ligand "${val}" not found` },
          ]);
          reject();
        }
      });
    },
    DISPLAY_TOAST(context, params) {
      Toast.show(params);
    },
  },
});

export default store;
