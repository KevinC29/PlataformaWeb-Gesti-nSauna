import { handleError } from '@/middleware/errorHandler';

export default {
    namespaced: true,
    state() {
        return {
            sidebarItems: [
                {
                    icon: 'mdi-folder',
                    text: 'Clientes',
                    value: 'cliente',
                    href: '/Clientes',
                    roles: ['ADMIN', 'CASHIER'],
                },
                {
                    icon: 'mdi-folder',
                    text: 'Comentarios',
                    value: 'comentario',
                    href: '/Comentarios',
                    roles: ['ADMIN', 'CLIENT'],
                },
                {
                    icon: 'mdi-folder',
                    text: 'Credenciales',
                    value: 'credencial',
                    href: '/Credenciales',
                    roles: ['ADMIN'],
                },
                {
                    icon: 'mdi-folder',
                    text: 'Detalles de Ordenes',
                    value: 'detalleOrden',
                    href: '/DetalleOrdenes',
                    roles: ['ADMIN', 'CASHIER'],
                },
                {
                    icon: 'mdi-folder',
                    text: 'Items',
                    value: 'item',
                    href: '/Items',
                    roles: ['ADMIN', 'CASHIER'],
                },
                {
                    icon: 'mdi-folder',
                    text: 'Tipos de Item',
                    value: 'tipoItem',
                    href: '/TiposItem',
                    roles: ['ADMIN'],
                },
                {
                    icon: 'mdi-folder',
                    text: 'Ordenes',
                    value: 'orden',
                    href: '/Ordenes',
                    roles: ['ADMIN', 'CASHIER', 'MANAGER'],
                },
                {
                    icon: 'mdi-folder',
                    text: 'Roles',
                    value: 'rol',
                    href: '/Roles',
                    roles: ['ADMIN'],
                },
                {
                    icon: 'mdi-folder',
                    text: 'Secciones',
                    value: 'seccion',
                    href: '/dashboard/sections',
                    roles: ['ADMIN'],
                },
                {
                    icon: 'mdi-folder',
                    text: 'Usuarios',
                    value: 'usuario',
                    href: '/Usuarios',
                    roles: ['ADMIN', 'CASHIER'],
                }
            ],
            filteredItems: [],
            userRole: null 
        };
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
        }
    },
    getters: {
        userRole(state) {
            return state.userRole; 
        },
        sidebarItems(state) {
            return state.sidebarItems;
        },
        filteredSidebarItems(state) {
            return state.filteredItems;
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
                handleError(error);
            }
        },
        cleanSidebar({ commit }) {
            try {
                commit('CLEAR_SIDEBAR');
            } catch (error) {
                handleError(error);
            }
        }
    }
};