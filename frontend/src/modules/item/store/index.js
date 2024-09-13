import {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem
  } from '@/api/services/itemService';
  
  export default {
    namespaced: true,
    state: {
      items: [],
      item: null,
      error: '',
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
      }
    },
    actions: {
      async fetchItems({ commit }) {
        try {
          const response = await getItems();
          commit('SET_ITEMS', response.data);
          return null;
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to fetch items';
          commit('SET_ERROR', errorMsg);
          return errorMsg;
        }
      },
      async fetchItem({ commit }, id) {
        try {
          const response = await getItem(id);
          commit('SET_ITEM', response.data);
          return null;
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to fetch item';
          commit('SET_ERROR', errorMsg);
          return errorMsg;
        }
      },
      async createItem({ commit }, itemData) {
        try {
          const response = await createItem(itemData);
          commit('ADD_ITEM', response.data);
          return null;
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to create item';
          commit('SET_ERROR', errorMsg);
          return errorMsg;
        }
      },
      async updateItem({ commit }, { id, itemData }) {
        try {
          const response = await updateItem(id, itemData);
          commit('UPDATE_ITEM', response.data);
          return null;
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to update item';
          commit('SET_ERROR', errorMsg);
          return errorMsg;
        }
      },
      async deleteItem({ commit }, id) {
        try {
          await deleteItem(id);
          commit('DELETE_ITEM', id);
          return null;
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to delete item';
          commit('SET_ERROR', errorMsg);
          return errorMsg;
        }
      },
      async fetchAndSetItemTypes({ dispatch, commit }) {
        try {
          await dispatch('itemType/fetchItemTypes', null, { root: true });
          const itemTypes = this.getters['itemType/itemTypes'];
          commit('SET_ITEMTYPES', itemTypes);
          return null;
        } catch (error) {
          const errorMsg = error.response?.data?.error || 'Failed to fetch item types';
          commit('SET_ERROR', errorMsg);
          return errorMsg;
        }
      }
    },
    getters: {
      items: state => state.items,
      item: state => state.item,
      error: state => state.error,
      itemTypes: state => state.itemTypes
    }
  };
  