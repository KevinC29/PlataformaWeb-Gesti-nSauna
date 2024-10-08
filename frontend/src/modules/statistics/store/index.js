import {
    getOrdersByDate,
} from '@/api/services/orderService';

import { handleError } from '@/middleware/errorHandler';
import { handleSuccess } from '@/middleware/successHandler';


export default {
    namespaced: true,
    state: {
        orders: [],
        error: '',
        success: '',
    },
    mutations: {
        SET_ORDERS(state, orders) {
            state.orders = orders;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_SUCCESS(state, success) {
            state.success = success;
        }
    },
    actions: {
        async fetchOrders({ commit }, { startDate, endDate }) {
            try {
              const response = await getOrdersByDate({ startDate, endDate });
              commit('SET_ORDERS', response.data); 
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
        orders: state => state.orders,
        error: state => state.error,
        success: state => state.success,
    }
};
