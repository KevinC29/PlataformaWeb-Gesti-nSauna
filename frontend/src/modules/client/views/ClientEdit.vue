<template>
    <div>
      <h1>Edit Client</h1>
      <ClientForm :clientData="client" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { getClient, saveClient } from '@/api/clientService';
  import ClientForm from '@/components/ClientForm.vue';
  
  export default {
    components: { ClientForm },
    setup(props) {
      const client = ref({});
  
      const loadClient = async () => {
        try {
          client.value = await getClient(props.$route.params.id);
        } catch (error) {
          // Handle error
        }
      };
  
      onMounted(loadClient);
  
      return { client };
    }
  };
  </script>
  