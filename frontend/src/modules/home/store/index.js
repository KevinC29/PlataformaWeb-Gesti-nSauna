// src/modules/home/store/index.js

import { getSectionsWithItems } from '@/api/services/sectionService';

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
        console.log("llegue aqui 2")
        console.log(data)
        commit('SET_SECTIONS', data.data);
      } catch (error) {
        console.error('Failed to fetch sections with items:', error);
      }
    }
  },
  getters: {
    sections: state => state.sections
  }
};
