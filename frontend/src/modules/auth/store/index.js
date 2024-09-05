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
    async login({ commit, dispatch}, credentials) {
      try {
        const response = await authLogin(credentials);
        commit('SET_TOKEN', response.token);
        // Actualiza los ítems del sidebar después del login
        await dispatch('dashboard/updateSidebarItems', null, { root: true });
      } catch (error) {
        handleError(error);
        throw error;
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
    async logout({ commit, dispatch }) {
      try {
        commit('REMOVE_TOKEN');  // Remueve el token de Vuex y localStorage
        // Limpia los ítems del sidebar
        dispatch('dashboard/cleanSidebar', null, { root: true }); // Limpiar el sidebar
      } catch (error) {
        handleError(error);
      }
    }
  },
  getters: {
    token: state => state.token,
    isAuthenticated: state => !!state.token
  }
};