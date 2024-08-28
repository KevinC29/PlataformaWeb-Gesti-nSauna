import { reactive } from 'vue';
import { getClients, getClient, createClient, updateClient, deleteClient } from '@/api/services/clientService';
import { handleError } from '@/middleware/errorHandler';

const state = reactive({
  clients: []
});

const actions = {
  async loadClients({ commit }) {
    try {
      const data = await getClients();
      commit('SET_CLIENTS', data.data);
    } catch (error) {
      handleError(error);
    }
  },
  async loadClient({ commit }, id) {
    try {
      const data = await getClient(id);
      return data.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async createClient({ commit }, clientData) {
    try {
      const data = await createClient(clientData);
      commit('ADD_CLIENT', data.data);
      return data.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async updateClient({ commit }, { id, clientData }) {
    try {
      const data = await updateClient(id, clientData);
      commit('UPDATE_CLIENT', data.data);
      return data.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },
  async removeClient({ commit }, id) {
    try {
      await deleteClient(id);
      commit('REMOVE_CLIENT', id);
    } catch (error) {
      handleError(error);
      throw error;
    }
  }
};

const mutations = {
  SET_CLIENTS(state, clients) {
    state.clients = clients;
  },
  ADD_CLIENT(state, client) {
    state.clients.push(client);
  },
  UPDATE_CLIENT(state, updatedClient) {
    const index = state.clients.findIndex(client => client._id === updatedClient._id);
    if (index !== -1) {
      state.clients[index] = updatedClient;
    }
  },
  REMOVE_CLIENT(state, id) {
    state.clients = state.clients.filter(client => client._id !== id);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
