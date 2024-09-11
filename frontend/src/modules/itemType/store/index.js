import {
  createItemType,
  getItemTypes,
  getItemType,
  updateItemType,
  deleteItemType
} from '@/api/services/itemTypeService';

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
        const errorMsg = error.response?.data?.error || 'Failed to fetch itemTypes';
        commit('SET_ERROR', errorMsg);
        return errorMsg;
      }
    },
    async fetchItemType({ commit }, id) {
      try {
        const response = await getItemType(id);
        commit('SET_ITEMTYPE', response.data);
        return null;
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to fetch itemType';
        commit('SET_ERROR', errorMsg);
        return errorMsg;
      }
    },
    async createItemType({ commit }, itemTypeData) {
      try {
        const response = await createItemType(itemTypeData);
        commit('ADD_ITEMTYPE', response.data);
        return null;
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to create itemType';
        commit('SET_ERROR', errorMsg);
        return errorMsg; 
      }
    },
    async updateItemType({ commit }, { id, itemTypeData }) {
      try {
        const response = await updateItemType(id, itemTypeData);
        commit('UPDATE_ITEMTYPE', response.data);
        return null;
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to update itemType';
        commit('SET_ERROR', errorMsg);
        return errorMsg; 
      }
    },
    async deleteItemType({ commit }, id) {
      try {
        await deleteItemType(id);
        commit('DELETE_ITEMTYPE', id);
        return null;
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to delete itemType';
        commit('SET_ERROR', errorMsg);
        return errorMsg;
      }
    },
    async fetchAndSetSections({ dispatch, commit }) {
      try {
        await dispatch('section/fetchSections', null, { root: true });
        const sections = this.getters['section/sections'];
        commit('SET_SECTIONS', sections);
        return null;
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to fetch sections';
        commit('SET_ERROR', errorMsg);
        return errorMsg;
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
