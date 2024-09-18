import {
    createClient,
    getClients,
    getClient,
    updateClient,
    deleteClient
} from '@/api/services/clientService';

export default {
    namespaced: true,
    state: {
        clients: [],
        client: null,
        error: '',
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
        }
    },
    actions: {
        async fetchClients({ commit }) {
            try {
                const response = await getClients();
                commit('SET_CLIENTS', response.data);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to fetch clients';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        },
        async fetchClient({ commit }, id) {
            try {
                const response = await getClient(id);
                commit('SET_CLIENT', response.data);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to fetch client';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        },
        async createClient({ commit }, clientData) {
            try {
                const response = await createClient(clientData);
                commit('ADD_CLIENT', response.data);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to create client';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        },
        async updateClient({ commit }, { id, clientData }) {
            try {
                const response = await updateClient(id, clientData);
                commit('UPDATE_CLIENT', response.data);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to update client';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        },
        async deleteClient({ commit }, id) {
            try {
                await deleteClient(id);
                commit('DELETE_CLIENT', id);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to delete client';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        },
        async fetchAndSetUsers({ dispatch, commit }) {
            try {
                await dispatch('user/fetchUsers', null, { root: true });
                const users = this.getters['user/users'];
                commit('SET_USERS', users);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to fetch users';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        },
    },
    getters: {
        clients: state => state.clients,
        client: state => state.client,
        error: state => state.error,
        users: state => state.users,
    }
};
