import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,
  state: {
    clients: [],
  },
  mutations: {
    setClients(state, clients) {
      state.clients = clients;
    },
  },
  actions: {
    fetchClients({ commit }) {
      // Lógica para obtener los clientes de la API
    },
  },
  getters: {
    getClients(state) {
      return state.clients;
    },
  },
};
