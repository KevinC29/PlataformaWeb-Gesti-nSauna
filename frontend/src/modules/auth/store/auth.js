// modules/auth/store/auth.js
import { login, resetPassword } from '../services/authServices';

const state = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null
};

const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  SET_TOKEN(state, token) {
    state.token = token;
    localStorage.setItem('token', token);
  },
  LOGOUT(state) {
    state.user = null;
    state.token = null;
    localStorage.removeItem('token');
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  }
};

const actions = {
  async login({ commit }, { email, password }) {
    commit('SET_LOADING', true);
    try {
      const response = await login(email, password);
      commit('SET_USER', response.user);
      commit('SET_TOKEN', response.token);
    } catch (error) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  },
  async logout({ commit }) {
    commit('LOGOUT');
    // Opcionalmente, realizar una solicitud de cierre de sesión en el backend
  },
  async resetPassword({ commit }, email) {
    commit('SET_LOADING', true);
    try {
      await resetPassword(email);
    } catch (error) {
      commit('SET_ERROR', error.message);
    } finally {
      commit('SET_LOADING', false);
    }
  }
};

const getters = {
  isAuthenticated: (state) => !!state.token,
  currentUser: (state) => state.user,
  isLoading: (state) => state.loading,
  authError: (state) => state.error
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
