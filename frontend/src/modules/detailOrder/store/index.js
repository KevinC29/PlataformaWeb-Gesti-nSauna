import {
    createDetailOrder,
    getDetailsOrder,
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
        errorDetail: '',
        successDetail: '',
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
            const index = state.detailsOrder.findIndex(detailOrder => detailOrder._id === updatedDetailOrder._id);
            if (index !== -1) {
                state.detailOrder.splice(index, 1, updatedDetailOrder);
            }
        },
        DELETE_DETAILORDER(state, detailOrderId) {
            state.detailsOrder = state.detailsOrder.filter(detailOrder => detailOrder._id !== detailOrderId);
        },
        SET_ERROR(state, errorDetail) {
            state.errorDetail = errorDetail;
        },
        SET_SUCCESS(state, successDetail) {
            state.successDetail = successDetail;
        }
    },
    actions: {
        async fetchDetailsOrder({ commit }) {
            try {
                const response = await getDetailsOrder();
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
        async updateDetailOrder({ commit }, { id, detailOrderData }) {
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
        async deleteDetailOrder({ commit }, id) {
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
        errorDetail: state => state.errorDetail,
        successDetail: state => state.successDetail,
    }
};
