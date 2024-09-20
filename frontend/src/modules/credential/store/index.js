import {
    updateUser,
} from '@/api/services/userService';
import { updateCredentialPassword,
    getUserByAuthenticatedUser,
 } from '@/api/services/credentialService';
 import { handleError } from '@/middleware/errorHandler';
//  import { handleSuccess } from '@/middleware/successHandler';

export default {
    namespaced: true,
    state: {
        user: {},
        error: ''
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        },
        UPDATE_USER(state, updatedUser) {
            if (state.user._id === updatedUser._id) {
                Object.assign(state.user, updatedUser);
            }
        },
        SET_ERROR(state, error) {
            state.error = error;
        }
    },
    actions: {
        async updateUser({ commit }, { id, userData }) {
            try {
                const response = await updateUser(id, userData);
                commit('UPDATE_USER', response.data);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchAndSetUser({ commit }) {
            try { 
                const response = await getUserByAuthenticatedUser();
                commit('SET_USER', response.data);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async updatePasswordCredential({ commit }, { id, credentialData }) {
            try {
                await updateCredentialPassword(id, credentialData);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        }
    },
    getters: {
        user: state => state.user,
        error: state => state.error
    }
};
