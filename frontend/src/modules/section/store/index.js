import {
  createSection,
  getSections,
  getSection,
  updateSection,
  deleteSection
} from '@/api/services/sectionService';

export default {
  namespaced: true,
  state: {
    sections: [],
    section: null,
    error: ''  
  },
  mutations: {
    SET_SECTIONS(state, sections) {
      state.sections = sections;
    },
    SET_SECTION(state, section) {
      state.section = section;
    },
    ADD_SECTION(state, section) {
      state.sections.push(section);
    },
    UPDATE_SECTION(state, updatedSection) {
      const index = state.sections.findIndex(section => section._id === updatedSection._id);
      if (index !== -1) {
        state.sections.splice(index, 1, updatedSection);
      }
    },
    DELETE_SECTION(state, sectionId) {
      state.sections = state.sections.filter(section => section._id !== sectionId);
    },
    SET_ERROR(state, error) { 
      state.error = error;
    }
  },
  actions: {
    async fetchSections({ commit }) {
      try {
        const response = await getSections();
        commit('SET_SECTIONS', response.data);
        return null; 
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to fetch sections';
        commit('SET_ERROR', errorMsg);
        return errorMsg;
      }
    },
    async fetchSection({ commit }, id) {
      try {
        const response = await getSection(id);
        commit('SET_SECTION', response.data);
        return null;
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to fetch section';
        commit('SET_ERROR', errorMsg);
        return errorMsg;
      }
    },
    async createSection({ commit }, sectionData) {
      try {
        const response = await createSection(sectionData);
        commit('ADD_SECTION', response.data);
        return null;
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to create section';
        commit('SET_ERROR', errorMsg);
        return errorMsg; 
      }
    },
    async updateSection({ commit }, { id, sectionData }) {
      try {
        const response = await updateSection(id, sectionData);
        commit('UPDATE_SECTION', response.data);
        return null;
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to update section';
        commit('SET_ERROR', errorMsg);
        return errorMsg; 
      }
    },
    async deleteSection({ commit }, id) {
      try {
        await deleteSection(id);
        commit('DELETE_SECTION', id);
        return null;
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to delete section';
        commit('SET_ERROR', errorMsg);
        return errorMsg;
      }
    }
  },
  getters: {
    sections: state => state.sections,
    section: state => state.section,
    error: state => state.error 
  }
};
