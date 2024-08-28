<template>
    <div>
      <h1>Delete Section</h1>
      <p>Are you sure you want to delete this section?</p>
      <button @click="deleteSection">Delete</button>
      <router-link to="/sections">Cancel</router-link>
    </div>
  </template>
  
  <script>
  import { useStore } from 'vuex';
  
  export default {
    setup(props, { root }) {
      const store = useStore();
      const id = root.$route.params.id;
  
      const deleteSection = async () => {
        await store.dispatch('deleteSection', id);
        root.$router.push('/sections');
      };
  
      return { deleteSection };
    }
  }
  </script>
  