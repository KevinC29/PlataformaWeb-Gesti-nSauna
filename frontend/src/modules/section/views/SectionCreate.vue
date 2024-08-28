<template>
  <div>
    <h1>Create Section</h1>
    <SectionForm @submit="createSection" />
  </div>
</template>

<script>
import SectionForm from '../components/SectionForm.vue';
import { useStore } from 'vuex';

export default {
  components: { SectionForm },
  setup() {
    const store = useStore();

    const createSection = async (sectionData) => {
      await store.dispatch('createSection', sectionData);
      store.$router.push('/sections');
    };

    return { createSection };
  }
}
</script>
