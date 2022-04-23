import Vue from "vue-native-core";
import Vuex from "vuex";
import ligands from "../../assets/ligands";
import { Toast } from "native-base";
import { apiRequest } from "../api";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import * as THREE from "three";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isEnrolledAsync: false,
    navigation: undefined,
    appState: undefined,
    isAutenticated: false,
    isCompatible: false,
    UserConectionCode: undefined,
    ligands: undefined,
    filtred_ligands: undefined,
    orientation: undefined,
    currOrientation: undefined,
    search_loading: false,
    loading: false,
    mech_font: undefined,

    //drowing part
    group: new THREE.Group(),
    labelsGroup: new THREE.Group(),
    font: undefined,
    camera: undefined,
    renderer: undefined,
    controls: undefined,
    sence: undefined,
    animation: false,
    parsedPdb: undefined,
    sceneLight: undefined,
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
    SET_MESH_FONT(state, data) {
      state.mech_font = data;
    },
  },
  actions: {
    LOAD_MESH_FONT(context) {
      const loader = new FontLoader();
      loader.load(
        "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_regular.typeface.json",
        (font) => {
          // do something with the font
          context.commit("SET_MESH_FONT", font);
        },
        // onError callback
        (err) => {
          console.log("font load: An error happened", err);
          context.commit("SET_MESH_FONT", null);
        }
      );
    },
    GET_LIGAND(context, param) {
      return new Promise((resolve, reject) => {
        apiRequest()
          .get(`${param}_ideal.pdb`)
          .then(({ data }) => {
            resolve(data);
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
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
          if (key.includes(val.toUpperCase()) || key.includes(val)) {
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
