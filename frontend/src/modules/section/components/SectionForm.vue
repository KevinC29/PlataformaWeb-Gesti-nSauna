<template>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="form.name" id="name" required />
      </div>
      <div>
        <label for="isActive">Active:</label>
        <input type="checkbox" v-model="form.isActive" id="isActive" />
      </div>
      <button type="submit">{{ isEditing ? 'Update' : 'Create' }}</button>
    </form>
  </template>
  
  <script>
  import { ref, watch, computed } from 'vue';
  
  export default {
    props: {
      section: {
        type: Object,
        default: () => ({})
      }
    },
    setup(props, { emit }) {
      const form = ref({
        name: '',
        isActive: false
      });
  
      const isEditing = computed(() => !!props.section._id);
  
      watch(() => props.section, (newSection) => {
        form.value = { ...newSection };
      }, { immediate: true });
  
      const submitForm = () => {
        emit('submit', form.value);
      };
  
      return { form, isEditing, submitForm };
    }
  }
  </script>
  