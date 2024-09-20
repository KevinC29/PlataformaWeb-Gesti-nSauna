import {
  createItemType,
  getItemTypes,
  getItemType,
  updateItemType,
  deleteItemType
} from '@/api/services/itemTypeService';
import { handleError } from '@/middleware/errorHandler';
// import { handleSuccess } from '@/middleware/successHandler';

export default {
  namespaced: true,
  state: {
    itemTypes: [],
    itemType: null,
    error: '',
    sections: []
  },
  mutations: {
    SET_ITEMTYPES(state, itemTypes) {
      state.itemTypes = itemTypes;
    },
    SET_ITEMTYPE(state, itemType) {
      state.itemType = itemType;
    },
    ADD_ITEMTYPE(state, itemType) {
      state.itemTypes.push(itemType);
    },
    UPDATE_ITEMTYPE(state, updatedItemType) {
      const index = state.itemTypes.findIndex(itemType => itemType._id === updatedItemType._id);
      if (index !== -1) {
        state.itemTypes.splice(index, 1, updatedItemType);
      }
    },
    DELETE_ITEMTYPE(state, itemTypeId) {
      state.itemTypes = state.itemTypes.filter(itemType => itemType._id !== itemTypeId);
    },
    SET_ERROR(state, error) { 
      state.error = error;
    },
    SET_SECTIONS(state, sections) {
      state.sections = sections;
    }
  },
  actions: {
    async fetchItemTypes({ commit }) {
      try {
        const response = await getItemTypes();
        commit('SET_ITEMTYPES', response.data);
        return null; 
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async fetchItemType({ commit }, id) {
      try {
        const response = await getItemType(id);
        commit('SET_ITEMTYPE', response.data);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async createItemType({ commit }, itemTypeData) {
      try {
        const response = await createItemType(itemTypeData);
        commit('ADD_ITEMTYPE', response.data);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async updateItemType({ commit }, { id, itemTypeData }) {
      try {
        const response = await updateItemType(id, itemTypeData);
        commit('UPDATE_ITEMTYPE', response.data);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async deleteItemType({ commit }, id) {
      try {
        await deleteItemType(id);
        commit('DELETE_ITEMTYPE', id);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async fetchAndSetSections({ dispatch, commit }) {
      try {
        await dispatch('section/fetchSections', null, { root: true });
        const sections = this.getters['section/sections'];
        commit('SET_SECTIONS', sections);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    }
  },
  getters: {
    itemTypes: state => state.itemTypes,
    itemType: state => state.itemType,
    error: state => state.error,
    sections: state => state.sections
  }
};
