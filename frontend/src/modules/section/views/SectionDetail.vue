<template>
  <div>
    <h1>Section Detail</h1>
    <p><strong>Name:</strong> {{ section.name }}</p>
    <p><strong>Status:</strong> {{ section.isActive ? 'Active' : 'Inactive' }}</p>
    <router-link :to="`/sections/${section._id}/edit`">Edit</router-link>
    <router-link :to="`/sections/${section._id}/delete`">Delete</router-link>
    <router-link to="/sections">Back to List</router-link>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const section = computed(() => store.getters['section/section']); // Asegúrate de que el getter sea correcto

    onMounted(() => {
      const id = route.params.id;
      store.dispatch('section/fetchSection', id); // Usa el nombre del módulo
    });

    return { section };
  }
}
</script>
