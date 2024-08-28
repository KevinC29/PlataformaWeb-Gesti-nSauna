<template>
    <div>
      <h1>Edit Section</h1>
      <SectionForm :section="section" @submit="updateSection" />
    </div>
  </template>
  
  <script>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import SectionForm from '../components/SectionForm.vue';
  
  export default {
    components: { SectionForm },
    setup(props, { root }) {
      const store = useStore();
      const section = computed(() => store.getters.section);
  
      onMounted(() => {
        const id = root.$route.params.id;
        store.dispatch('fetchSection', id);
      });
  
      const updateSection = async (sectionData) => {
        const id = root.$route.params.id;
        await store.dispatch('updateSection', { id, sectionData });
        root.$router.push('/sections');
      };
  
      return { section, updateSection };
    }
  }
  </script>
  