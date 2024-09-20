import { getSectionsWithItems } from '@/api/services/sectionService';
import { handleError } from '@/middleware/errorHandler';

export default {
  namespaced: true,
  state: {
    sections: []
  },
  mutations: {
    SET_SECTIONS(state, sections) {
      state.sections = sections;
    }
  },
  actions: {
    async fetchSections({ commit }) {
      try {
        const data = await getSectionsWithItems();
        commit('SET_SECTIONS', data.data);
      } catch (error) {
        console.error('Failed to fetch sections with items:', error);
        handleError(error);
        throw error;
      }
    }
  },
  getters: {
    sections: state => state.sections
  }
};
