import {
    createDetailOrder,
    getDetailOrders,
    getDetailOrder,
    getDetailsOrderByOrder,
    updateDetailOrder,
    deleteDetailOrder
} from '@/api/services/detailOrderService';

import { handleError } from '@/middleware/errorHandler';
import { handleSuccess } from '@/middleware/successHandler';


export default {
    namespaced: true,
    state: {
        detailsOrder: [],
        detailOrder: null,
        error: '',
        success: '',
        detailsOrderbyOrder: [],
    },
    mutations: {
        SET_DETAILSORDER(state, detailsOrder) {
            state.detailsOrder = detailsOrder;
        },
        SET_DETAILORDER(state, detailOrder) {
            state.detailOrder = detailOrder;
        },
        SET_DETAILSORDERBYORDER(state, detailsOrderbyOrder) {
            state.detailsOrderbyOrder = detailsOrderbyOrder;
        },
        ADD_DETAILORDER(state, detailOrder) {
            state.detailsOrder.push(detailOrder);
        },
        UPDATE_DETAILORDER(state, updatedDetailOrder) {
            // const index = state.detailsOrder.findIndex(detailOrder => detailOrder._id === updatedDetailOrder._id);
            // if (index !== -1) {
            //     state.detailOrder.splice(index, 1, updatedDetailOrder);
            // }
            if (state.detailOrder._id === updatedDetailOrder._id) {
                Object.assign(state.detailOrder, updatedDetailOrder);
            }
        },
        DELETE_DETAILORDER(state, detailOrderId) {
            state.detailsOrder = state.detailsOrder.filter(detailOrder => detailOrder._id !== detailOrderId);
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_SUCCESS(state, success) {
            state.success = success;
        }
    },
    actions: {
        async fetchOrders({ commit }) {
            try {
                const response = await getDetailOrders();
                commit('SET_DETAILSORDER', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchDetailOrder({ commit }, id) {
            try {
                const response = await getDetailOrder(id);
                commit('SET_DETAILORDER', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchDetailsOrderByOrder({ commit }, orderID) {
            try {
                const response = await getDetailsOrderByOrder(orderID);
                commit('SET_DETAILSORDERBYORDER', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async createDetailOrder({ commit }, detailOrderData) {
            try {
                const response = await createDetailOrder(detailOrderData);
                commit('ADD_DETAILORDER', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async updateOrder({ commit }, { id, detailOrderData }) {
            try {
                const response = await updateDetailOrder(id, detailOrderData);
                commit('UPDATE_DETAILORDER', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async deleteUser({ commit }, id) {
            try {
                const response = await deleteDetailOrder(id);
                commit('DELETE_DETAILORDER', id);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        }
    },
    getters: {
        detailsOrder: state => state.detailsOrder,
        detailOrder: state => state.detailOrder,
        detailsOrderbyOrder: state => state.detailsOrderbyOrder,
        error: state => state.error,
        success: state => state.success,
    }
};
