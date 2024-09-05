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
                    href: '/Secciones',
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
            userRole: null // Agregamos una propiedad para el rol del usuario
        };
    },
    mutations: {
        SET_FILTERED_ITEMS(state, items) {
            state.filteredItems = items;
        },
        CLEAR_SIDEBAR(state) {
            state.filteredItems = [];
            state.userRole = null; // Limpiamos el rol
        },
        SET_USER_ROLE(state, role) {
            state.userRole = role; // Configuramos el rol del usuario
        }
    },
    getters: {
        userRole() {
            try {
                const token = localStorage.getItem(process.env.VUE_APP_TOKEN_NAME);
                if (!token) return null;
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.role;
            } catch (error) {
                handleError(error);
                return null;
            }
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
                const role = getters.userRole;
                console.log('Role:', role); // Verifica el rol
                if (!role) {
                    commit('SET_FILTERED_ITEMS', []);
                    return;
                }
                const filteredItems = getters.sidebarItems.filter(item => item.roles.includes(role));
                console.log('Filtered Items:', filteredItems); // Verifica los ítems filtrados
                commit('SET_FILTERED_ITEMS', filteredItems);
            } catch (error) {
                handleError(error);
            }
        },
        cleanSidebar({ commit, state }) {
            try {
                commit('CLEAR_SIDEBAR'); // Limpiar el sidebar y el rol
                // Mostrar el estado después de limpiar
                console.log('Sidebar Cleaned:');
                console.log('Filtered Items:', state.filteredItems);
                console.log('User Role:', state.userRole);
            } catch (error) {
                handleError(error);
            }
        }
    },
};