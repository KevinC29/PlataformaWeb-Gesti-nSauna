import {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} from '@/api/services/userService';

export default {
    namespaced: true,
    state: {
        users: [],
        user: null,
        roles: [], // Estado para los roles
        error: ''
    },
    mutations: {
        SET_USERS(state, users) {
            state.users = users;
        },
        SET_USER(state, user) {
            state.user = user;
        },
        ADD_USER(state, user) {
            state.users.push(user);
        },
        UPDATE_USER(state, updatedUser) {
            const index = state.users.findIndex(user => user._id === updatedUser._id);
            if (index !== -1) {
                state.users.splice(index, 1, updatedUser);
            }
        },
        DELETE_USER(state, userId) {
            state.users = state.users.filter(user => user._id !== userId);
        },
        SET_ROLES(state, roles) {
            state.roles = roles;
        },
        SET_ERROR(state, error) {
            state.error = error;
        }
    },
    actions: {
        async fetchUsers({ commit }) {
            try {
                const response = await getUsers();
                commit('SET_USERS', response.data);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to fetch users';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        },
        async fetchUser({ commit }, id) {
            try {
                const response = await getUser(id);
                commit('SET_USER', response.data);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to fetch user';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        },
        async createUser({ commit }, userData) {
            try {
                const response = await createUser(userData);
                commit('ADD_USER', response.data);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to create user';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        },
        async updateUser({ commit }, { id, userData }) {
            try {
                const response = await updateUser(id, userData);
                commit('UPDATE_USER', response.data);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to update user';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        },
        async deleteUser({ commit }, id) {
            try {
                await deleteUser(id);
                commit('DELETE_USER', id);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to delete user';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        },
        async fetchAndSetRoles({ dispatch, commit }) {
            try {
                await dispatch('role/fetchRoles', null, { root: true }); // Asegúrate de que el módulo 'role' exista y tenga 'fetchRoles'
                const roles = this.getters['role/roles'];
                commit('SET_ROLES', roles);
                return null;
            } catch (error) {
                const errorMsg = error.response?.data?.error || 'Failed to fetch roles';
                commit('SET_ERROR', errorMsg);
                return errorMsg;
            }
        }
    },
    getters: {
        users: state => state.users,
        user: state => state.user,
        roles: state => state.roles,
        error: state => state.error
    }
};
