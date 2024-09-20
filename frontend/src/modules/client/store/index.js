import {
    createClient,
    getClients,
    getClient,
    updateClient,
    deleteClient
} from '@/api/services/clientService';
import { handleError } from '@/middleware/errorHandler';
import { handleSuccess } from '@/middleware/successHandler';

export default {
    namespaced: true,
    state: {
        clients: [],
        client: null,
        error: '',
        success: '',
        users: [],
    },
    mutations: {
        SET_CLIENTS(state, clients) {
            state.clients = clients;
        },
        SET_CLIENT(state, client) {
            state.client = client;
        },
        ADD_CLIENT(state, client) {
            state.clients.push(client);
        },
        UPDATE_CLIENT(state, updatedClient) {
            const index = state.clients.findIndex(client => client._id === updatedClient._id);
            if (index !== -1) {
                state.clients.splice(index, 1, updatedClient);
            }
        },
        DELETE_CLIENT(state, clientId) {
            state.clients = state.clients.filter(client => client._id !== clientId);
        },
        SET_USERS(state, users) {
            state.users = users;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_SUCCESS(state, success) {
            state.success = success;
        }
    },
    actions: {
        async fetchClients({ commit }) {
            try {
                const response = await getClients();
                commit('SET_CLIENTS', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchClient({ commit }, id) {
            try {
                const response = await getClient(id);
                commit('SET_CLIENT', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async createClient({ commit }, clientData) {
            try {
                const response = await createClient(clientData);
                commit('ADD_CLIENT', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async updateClient({ commit }, { id, clientData }) {
            try {
                const response = await updateClient(id, clientData);
                commit('UPDATE_CLIENT', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async deleteClient({ commit }, id) {
            try {
                const response = await deleteClient(id);
                commit('DELETE_CLIENT', id);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchAndSetUsers({ dispatch, commit }) {
            try {
                const response = await dispatch('user/fetchUsers', null, { root: true });
                const users = this.getters['user/users'];
                commit('SET_USERS', users);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
    },
    getters: {
        clients: state => state.clients,
        client: state => state.client,
        error: state => state.error,
        success: state => state.success,
        users: state => state.users,
    }
};
