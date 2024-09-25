import {
  createItem,
  getItems,
  getItem,
  updateItem,
  deleteItem
} from '@/api/services/itemService';
import { handleError } from '@/middleware/errorHandler';
import { handleSuccess } from '@/middleware/successHandler';

export default {
  namespaced: true,
  state: {
    items: [],
    item: null,
    error: '',
    success: '',
    itemTypes: []
  },
  mutations: {
    SET_ITEMS(state, items) {
      state.items = items;
    },
    SET_ITEM(state, item) {
      state.item = item;
    },
    ADD_ITEM(state, item) {
      state.items.push(item);
    },
    UPDATE_ITEM(state, updatedItem) {
      const index = state.items.findIndex(item => item._id === updatedItem._id);
      if (index !== -1) {
        state.items.splice(index, 1, updatedItem);
      }
    },
    DELETE_ITEM(state, itemId) {
      state.items = state.items.filter(item => item._id !== itemId);
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_ITEMTYPES(state, itemTypes) {
      state.itemTypes = itemTypes;
    },
    SET_SUCCESS(state, success) {
      state.success = success;
    }
  },
  actions: {
    async fetchItems({ commit }) {
      try {
        const response = await getItems();
        commit('SET_ITEMS', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async fetchItem({ commit }, id) {
      try {
        const response = await getItem(id);
        commit('SET_ITEM', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async createItem({ commit }, itemData) {
      try {
        const response = await createItem(itemData);
        commit('ADD_ITEM', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async updateItem({ commit }, { id, itemData }) {
      try {
        const response = await updateItem(id, itemData);
        commit('UPDATE_ITEM', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async deleteItem({ commit }, id) {
      try {
        const response = await deleteItem(id);
        commit('DELETE_ITEM', id);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async fetchAndSetItemTypes({ dispatch, commit }) {
      try {
        const response = await dispatch('itemType/fetchItemTypes', null, { root: true });
        const itemTypes = this.getters['itemType/itemTypes'];
        commit('SET_ITEMTYPES', itemTypes);
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
    items: state => state.items,
    item: state => state.item,
    error: state => state.error,
    success: state => state.success,
    itemTypes: state => state.itemTypes
  }
};
