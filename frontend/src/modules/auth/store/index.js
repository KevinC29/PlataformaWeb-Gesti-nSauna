import { login as authLogin, resetPassword as authResetPassword } from '@/api/services/authService';
import { handleError } from '@/middleware/errorHandler';

export default {
  namespaced: true,
  state() {
    return {
      token: localStorage.getItem(process.env.VUE_APP_TOKEN_NAME) || '',
    };
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem(process.env.VUE_APP_TOKEN_NAME, token);
    },
    REMOVE_TOKEN(state) {
      state.token = '';
      localStorage.removeItem(process.env.VUE_APP_TOKEN_NAME);
    }
  },
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await authLogin(credentials);
        commit('SET_TOKEN', response.token);
      } catch (error) {
        handleError(error);
        throw error;  // Re-lanzar para que el componente maneje el error
      }
    },
    async resetPassword(_, email) {
      try {
        await authResetPassword(email);
      } catch (error) {
        handleError(error);
        throw error;  // Re-lanzar para que el componente maneje el error
      }
    },
    logout({ commit }) {
      commit('REMOVE_TOKEN');
    }
  },
  getters: {
    token: state => state.token
  }
};
