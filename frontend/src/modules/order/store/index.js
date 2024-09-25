import {
    createOrder,
    getOrders,
    getOrder,
    updateOrder,
    deleteOrder
} from '@/api/services/orderService';

import { handleError } from '@/middleware/errorHandler';
import { handleSuccess } from '@/middleware/successHandler';


export default {
    namespaced: true,
    state: {
        orders: [],
        order: null,
        clients: [],
        error: '',
        success: '',
        items: [],
        detailsOrder: [],
        detailOrder: null,
    },
    mutations: {
        SET_ORDERS(state, orders) {
            state.orders = orders;
        },
        SET_ORDER(state, order) {
            state.order = order;
        },
        ADD_ORDER(state, order) {
            state.orders.push(order);
        },
        UPDATE_ORDER(state, updatedOrder) {
            const index = state.orders.findIndex(order => order._id === updatedOrder._id);
            if (index !== -1) {
                state.order.splice(index, 1, updatedOrder);
            }
        },
        DELETE_ORDER(state, orderId) {
            state.orders = state.orders.filter(order => order._id !== orderId);
        },
        SET_CLIENTS(state, clients) {
            state.clients = clients;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_SUCCESS(state, success) {
            state.success = success;
        },
        SET_DETAILSORDER(state, detailsOrder) {
            state.detailsOrder = detailsOrder;
        },
        SET_DETAILORDER(state, detailOrder) {
            state.detailOrder = detailOrder;
        },
    },
    actions: {
        async fetchOrders({ commit }) {
            try {
                const response = await getOrders();
                commit('SET_ORDERS', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchOrder({ commit }, id) {
            try {
                const response = await getOrder(id);
                commit('SET_ORDER', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async createOrder({ commit }, orderData) {
            try {
                const response = await createOrder(orderData);
                commit('ADD_ORDER', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async updateOrder({ commit }, { id, orderData }) {
            try {
                const response = await updateOrder(id, orderData);
                commit('UPDATE_ORDER', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async deleteOrder({ commit }, id) {
            try {
                const response = await deleteOrder(id);
                commit('DELETE_ORDER', id);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchAndSetClients({ dispatch, commit }) {
            try {
                const response = await dispatch('client/fetchClients', null, { root: true });
                const clients = this.getters['client/clients'];
                commit('SET_CLIENTS', clients);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchAndSetDetailsOrder({ dispatch, commit }, orderID) {
            try {
                const response = await dispatch('detailOrder/fetchDetailsOrderByOrder', orderID, { root: true });
                const detailsOrder = this.getters['detailOrder/detailsOrderbyOrder'];
                commit('SET_DETAILSORDER', detailsOrder);
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
        orders: state => state.orders,
        order: state => state.order,
        clients: state => state.clients,
        error: state => state.error,
        success: state => state.success,
        detailsOrder: state => state.detailsOrder,
    }
};
