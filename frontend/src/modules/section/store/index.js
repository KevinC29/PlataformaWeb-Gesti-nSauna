import {
  createSection,
  getSections,
  getSection,
  updateSection,
  deleteSection
} from '@/api/services/sectionService';
import { handleError } from '@/middleware/errorHandler';
import { handleSuccess } from '@/middleware/successHandler';

export default {
  namespaced: true,
  state: {
    sections: [],
    section: null,
    error: '',
    success: '',
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
    },
    SET_SUCCESS(state, success) {
      state.success = success;
    }
  },
  actions: {
    async fetchSections({ commit }) {
      try {
        const response = await getSections();
        commit('SET_SECTIONS', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null; 
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async fetchSection({ commit }, id) {
      try {
        const response = await getSection(id);
        commit('SET_SECTION', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async createSection({ commit }, sectionData) {
      try {
        const response = await createSection(sectionData);
        commit('ADD_SECTION', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async updateSection({ commit }, { id, sectionData }) {
      try {
        const response = await updateSection(id, sectionData);
        commit('UPDATE_SECTION', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async deleteSection({ commit }, id) {
      try {
        const response = await deleteSection(id);
        commit('DELETE_SECTION', id);
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
    sections: state => state.sections,
    section: state => state.section,
    error: state => state.error,
    success: state => state.success,
  }
};
