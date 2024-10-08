import { handleError } from '@/middleware/errorHandler';
import { handleSuccess } from '@/middleware/successHandler';

export default {
    namespaced: true,
    state: {
        user: {},
        sidebarItems: [
            {
                icon: 'mdi-clipboard-account-outline',
                text: 'Clientes',
                value: 'cliente',
                href: '/dashboard/clients',
                roles: ['ADMIN', 'CASHIER'],
            },
            {
                icon: 'mdi-comment-text-multiple',
                text: 'Comentarios',
                value: 'comentario',
                href: '/dashboard/comments',
                roles: ['ADMIN', 'CLIENT'],
            },
            {
                icon: 'mdi-account-edit',
                text: 'Credenciales',
                value: 'credencial',
                href: '/dashboard/credentials',
                roles: ['ADMIN'],
            },
            {
                icon: 'mdi-store',
                text: 'Items',
                value: 'item',
                href: '/dashboard/items',
                roles: ['ADMIN', 'CASHIER'],
            },
            {
                icon: 'mdi-store',
                text: 'Tipos de Item',
                value: 'tipoItem',
                href: '/dashboard/itemTypes',
                roles: ['ADMIN'],
            },
            {
                icon: 'mdi-storefront',
                text: 'Secciones',
                value: 'seccion',
                href: '/dashboard/sections',
                roles: ['ADMIN'],
            },
            {
                icon: 'mdi-cart',
                text: 'Ordenes',
                value: 'orden',
                href: '/dashboard/orders',
                roles: ['ADMIN', 'CASHIER'],
            },
            {
                icon: 'mdi-cart',
                text: 'Estadísticas',
                value: 'estadistica',
                href: '/dashboard/statisticsByDate',
                roles: ['ADMIN', 'MANAGER'],
            },
            {
                icon: 'mdi-shield-lock',
                text: 'Roles',
                value: 'rol',
                href: '/dashboard/roles',
                roles: ['ADMIN'],
            },
            {
                icon: 'mdi-account-group',
                text: 'Usuarios',
                value: 'usuario',
                href: '/dashboard/users',
                roles: ['ADMIN', 'CASHIER'],
            }
        ],
        filteredItems: [],
        userRole: null,
        error: '',
        success: '',
    },
    mutations: {
        SET_FILTERED_ITEMS(state, items) {
            state.filteredItems = items;
        },
        CLEAR_SIDEBAR(state) {
            state.filteredItems = [];
            state.userRole = null;
        },
        SET_USER_ROLE(state, role) {
            state.userRole = role;
        },
        SET_USER(state, user) {
            state.user = user;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_SUCCESS(state, success) {
            state.success = success;
        }
    },
    actions: {
        updateSidebarItems({ commit, getters }) {
            try {
                const token = localStorage.getItem(process.env.VUE_APP_TOKEN_NAME);
                if (!token) {
                    commit('SET_FILTERED_ITEMS', []);
                    return;
                }
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.role;
                commit('SET_USER_ROLE', role);
                const filteredItems = getters.sidebarItems.filter(item => item.roles.includes(role));
                commit('SET_FILTERED_ITEMS', filteredItems);
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        cleanSidebar({ commit }) {
            try {
                commit('CLEAR_SIDEBAR');
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchAndSetUser({ dispatch, commit }) {
            try {
                const response = await dispatch('credential/fetchAndSetUser', null, { root: true });
                const { name, lastName, email } = this.getters['credential/user'];
                commit('SET_USER', { name, lastName, email });
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
        userRole: state => state.userRole,
        user: state => state.user,
        sidebarItems: state => state.sidebarItems,
        filteredSidebarItems: state => state.filteredItems,
        error: state => state.error,
        success: state => state.success,
    }
};