<template>
    <div>
      <p>Are you sure you want to delete this client?</p>
      <button @click="confirmDeletion">Yes</button>
      <button @click="$emit('cancel')">No</button>
    </div>
  </template>
  
  <script>
  import { deleteClient } from '@/api/clientService';
  
  export default {
    props: {
      clientId: {
        type: String,
        required: true
      }
    },
    methods: {
      async confirmDeletion() {
        try {
          await deleteClient(this.clientId);
          this.$emit('deleted');
          // Handle success, e.g., redirect or show a success message
        } catch (error) {
          // Handle error
        }
      }
    }
  };
  </script>
  