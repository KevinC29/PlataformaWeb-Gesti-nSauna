<template>
  <div>
    <h1>Section List</h1>
    <ul>
      <li v-for="section in sections" :key="section._id">
        {{ section.name }} - {{ section.isActive ? 'Active' : 'Inactive' }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SectionsList',
  computed: {
    ...mapGetters('section', ['sections'])
  },
  async created() {
    try {
      await this.$store.dispatch('section/fetchSections');
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  }
};
</script>
