<template>
    <div>
      <h1>Client List</h1>
      <ul>
        <li v-for="client in clients" :key="client._id">
          {{ client.user.name }} - {{ client.account }}
          <button @click="viewClient(client._id)">View</button>
          <button @click="editClient(client._id)">Edit</button>
          <button @click="confirmDelete(client._id)">Delete</button>
        </li>
      </ul>
      <ClientDeleteConfirmation v-if="showConfirm" :clientId="clientToDelete" @deleted="loadClients" @cancel="showConfirm = false" />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { fetchClients } from '@/api/clientService';
  import ClientDeleteConfirmation from '@/components/ClientDeleteConfirmation.vue';
  
  export default {
    components: { ClientDeleteConfirmation },
    setup() {
      const clients = ref([]);
      const showConfirm = ref(false);
      const clientToDelete = ref('');
  
      const loadClients = async () => {
        try {
          clients.value = await fetchClients();
        } catch (error) {
          // Handle error
        }
      };
  
      const viewClient = (id) => {
        // Redirect to the client detail page
        this.$router.push({ name: 'ClientDetail', params: { id } });
      };
  
      const editClient = (id) => {
        // Redirect to the edit client page
        this.$router.push({ name: 'ClientEdit', params: { id } });
      };
  
      const confirmDelete = (id) => {
        clientToDelete.value = id;
        showConfirm.value = true;
      };
  
      onMounted(loadClients);
  
      return { clients, showConfirm, clientToDelete, viewClient, editClient, confirmDelete };
    }
  };
  </script>
  