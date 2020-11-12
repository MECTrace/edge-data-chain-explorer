import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({

  state: {
    tableBreakpoint: 750,
    args: [100, 1000, 10000],
    alert: {
      open: false,
      timeout: undefined,
      msg: '',
      err: false,
      info: true,
      persistent: false
    },
    network: '',
  },

  mutations: {
    alert(state, payload) {
      state.alert = payload;
      state.open = !state.open;
    },

    network(state, payload) {
      state.network = payload;
    }
  },

  actions: {
  },

  getters: {
  },

  modules: {
  }
});
