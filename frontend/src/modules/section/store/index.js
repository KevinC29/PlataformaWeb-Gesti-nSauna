// src/modules/section/store/index.js

import {
  createSection,
  getSections,
  getSection,
  updateSection,
  updateSectionStatus,
  deleteSection
} from '@/api/services/sectionService';

export default {
  namespaced: true,
  state: {
    sections: [],
    section: null
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
    }
  },
  actions: {
    async fetchSections({ commit }) {
      try {
        const response = await getSections();
        console.log(response)
        commit('SET_SECTIONS', response.data);
      } catch (error) {
        console.error('Failed to fetch sections:', error);
      }
    },
    async fetchSection({ commit }, id) {
      try {
        const response = await getSection(id);
        commit('SET_SECTION', response.data);
      } catch (error) {
        console.error('Failed to fetch section:', error);
      }
    },
    async createSection({ commit }, sectionData) {
      try {
        const response = await createSection(sectionData);
        commit('ADD_SECTION', response.data);
      } catch (error) {
        console.error('Failed to create section:', error);
      }
    },
    async updateSection({ commit }, { id, sectionData }) {
      try {
        const response = await updateSection(id, sectionData);
        commit('UPDATE_SECTION', response.data);
      } catch (error) {
        console.error('Failed to update section:', error);
      }
    },
    async updateSectionStatus({ commit }, statusData) {
      try {
        const response = await updateSectionStatus(statusData);
        commit('UPDATE_SECTION', response.data);
      } catch (error) {
        console.error('Failed to update section status:', error);
      }
    },
    async deleteSection({ commit }, id) {
      try {
        await deleteSection(id);
        commit('DELETE_SECTION', id);
      } catch (error) {
        console.error('Failed to delete section:', error);
      }
    }
  },
  getters: {
    sections: state => state.sections,
    section: state => state.section
  }
};
