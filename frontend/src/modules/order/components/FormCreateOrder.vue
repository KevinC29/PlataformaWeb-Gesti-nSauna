<template>
    <form @submit.prevent="submitForm">
      <!-- Número de Orden -->
      <v-text-field v-model="state.numberOrder" label="Número de Orden" type="number" clearable dense required></v-text-field>
  
      <!-- Buscador de Cliente -->
      <v-autocomplete v-model="state.client" :items="filteredClientsList" item-value="_id" item-title="fullName"
        v-model:search-input="searchTerm" label="Buscar y Seleccionar Cliente" clearable dense :items-per-page="5"
        @update:search-input="filterClients"></v-autocomplete>
  
      <!-- Alerta de errores -->
      <v-alert v-if="errorMessage" type="error" dismissible>
        {{ errorMessage }}
      </v-alert>
  
      <!-- Alerta de éxito -->
      <v-alert v-if="successMessage" type="success" dismissible>
        {{ successMessage }}
      </v-alert>
  
      <!-- Botones -->
      <v-btn class="me-4" color="primary" type="submit">
        Guardar
      </v-btn>
      <v-btn color="secondary" @click="cancel">
        Cancelar
      </v-btn>
    </form>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  import { useVuelidate } from '@vuelidate/core';
  import { required } from '@vuelidate/validators';
  
  export default {
    data() {
      return {
        state: {
          numberOrder: null, 
          client: null,
        },
        clientsList: [],
        filteredClientsList: [],
        searchTerm: '',
        errorMessage: '',
        successMessage: '',
      };
    },
    computed: {
      ...mapGetters('order', ['clients', 'error', 'success']),
    },
    methods: {
      ...mapActions('order', ['createOrder', 'fetchAndSetClients']),
  
      async fetchData() {
        try {
          await this.fetchAndSetClients();
          this.clientsList = this.clients
            .filter(client => client.user.isActive)
            .map(client => ({
              _id: client._id,
              fullName: `${client.user.name} ${client.user.lastName} (${client.user.dni})`,
            }));
          this.filteredClientsList = this.clientsList;
          this.successMessage = this.success;
          this.errorMessage = '';
        } catch (error) {
          this.errorMessage = this.error;
          this.successMessage = '';
        }
      },
  
      filterClients(search) {
        const searchTerm = search.toLowerCase();
        this.filteredClientsList = this.clientsList.filter(client =>
          client.fullName.toLowerCase().includes(searchTerm)
        );
      },
  
      async submitForm() {
        this.v$.$touch();
  
        if (this.v$.$invalid) return;
  
        const orderData = {
          numberOrder: Number(this.state.numberOrder),
          client: this.state.client,
        };
  
        try {
          await this.createOrder(orderData);
          this.successMessage = this.success;
          this.errorMessage = '';
          setTimeout(() => {
            this.$router.push({ name: 'OrderList' });
          }, 2000);
        } catch (error) {
          this.errorMessage = this.error;
          this.successMessage = '';
        }
      },
  
      cancel() {
        this.$router.push({ name: 'OrderList' });
      },
    },
    validations() {
      return {
        state: {
          numberOrder: { required },
          client: { required },
        },
      };
    },
  
    setup() {
      const v$ = useVuelidate();
      return { v$ };
    },
    async created() {
      await this.fetchData();
    },
  };
</script>
  