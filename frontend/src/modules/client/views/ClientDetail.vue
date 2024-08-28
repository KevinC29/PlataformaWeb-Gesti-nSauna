<template>
    <div>
      <h1>Client Details</h1>
      <p>User: {{ client.user.name }}</p>
      <p>Account: {{ client.account }}</p>
      <p>Account State: {{ client.accountState }}</p>
      <button @click="editClient">Edit</button>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getClient } from '@/api/clientService';
  
  export default {
    setup(props) {
      const client = ref({});
  
      const loadClient = async () => {
        try {
          client.value = await getClient(props.$route.params.id);
        } catch (error) {
          // Handle error
        }
      };
  
      const editClient = () => {
        // Redirect to the edit client page
        this.$router.push({ name: 'ClientEdit', params: { id: props.$route.params.id } });
      };
  
      onMounted(loadClient);
  
      return { client, editClient };
    }
  };
  </script>
  