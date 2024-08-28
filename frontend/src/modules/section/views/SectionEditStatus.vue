<template>
    <div>
      <h1>Edit Section Status</h1>
      <SectionStatusToggle :status="section.isActive" @update="updateStatus" />
    </div>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import SectionStatusToggle from '../components/SectionStatusToggle.vue';
  
  export default {
    components: { SectionStatusToggle },
    setup(props, { root }) {
      const store = useStore();
      const section = computed(() => store.getters.section);
  
      onMounted(() => {
        const id = root.$route.params.id;
        store.dispatch('fetchSection', id);
      });
  
      const updateStatus = async (newStatus) => {
        const id = root.$route.params.id;
        await store.dispatch('updateSectionStatus', { id, isActive: newStatus });
        root.$router.push('/sections');
      };
  
      return { section, updateStatus };
    }
  }
  </script>
  