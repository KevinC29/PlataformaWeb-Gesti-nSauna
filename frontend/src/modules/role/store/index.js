import {
    createRole,
    getRoles,
    getRole,
    updateRole,
    deleteRole
  } from '@/api/services/roleService';
  
  export default {
    namespaced: true,
    state: {
      roles: [],
      role: null,
      error: ''
    },
    mutations: {
      SET_ROLES(state, roles) {
        state.roles = roles;
      },
      SET_ROLE(state, role) {
        state.role = role;
      },
      ADD_ROLE(state, role) {
        state.roles.push(role);
      },
      UPDATE_ROLE(state, updatedRole) {
        const index = state.roles.findIndex(role => role._id === updatedRole._id);
        if (index !== -1) {
          state.roles.splice(index, 1, updatedRole);
        }
      },
      DELETE_ROLE(state, roleId) {
        state.roles = state.roles.filter(role => role._id !== roleId);
      },
      SET_ERROR(state, error) {
        state.error = error;
      }
    },
    actions: {
      async fetchRoles({ commit }) {
        try {
          const response = await getRoles();
          commit('SET_ROLES', response.data);
          return null;
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to fetch roles';
          commit('SET_ERROR', errorMsg);
          return errorMsg;
        }
      },
      async fetchRole({ commit }, id) {
        try {
          const response = await getRole(id);
          commit('SET_ROLE', response.data);
          return null;
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to fetch role';
          commit('SET_ERROR', errorMsg);
          return errorMsg;
        }
      },
      async createRole({ commit }, roleData) {
        try {
          const response = await createRole(roleData);
          commit('ADD_ROLE', response.data);
          return null;
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to create role';
          commit('SET_ERROR', errorMsg);
          return errorMsg;
        }
      },
      async updateRole({ commit }, { id, roleData }) {
        try {
          const response = await updateRole(id, roleData);
          commit('UPDATE_ROLE', response.data);
          return null;
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to update role';
          commit('SET_ERROR', errorMsg);
          return errorMsg;
        }
      },
      async deleteRole({ commit }, id) {
        try {
          await deleteRole(id);
          commit('DELETE_ROLE', id);
          return null;
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to delete role';
          commit('SET_ERROR', errorMsg);
          return errorMsg;
        }
      }
    },
    getters: {
      roles: state => state.roles,
      role: state => state.role,
      error: state => state.error
    }
  };
  