<template>
  <form @submit.prevent="submitForm">
    <!-- Buscador de Usuario -->
    <v-autocomplete v-model="state.user" :items="filteredUsersList" item-value="_id" item-title="fullName"
      v-model:search-input="searchTerm" label="Buscar y Seleccionar Usuario" clearable dense :items-per-page="5"
      @update:search-input="filterUsers" :error-messages="v$.state.user.$errors.map(e => e.$message)"
      @blur="v$.state.user.$touch" @input="v$.state.user.$touch"></v-autocomplete>

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
import { createClientValidations } from '@/validators/clientValidations.js';

export default {
  data() {
    return {
      state: {
        user: null,
      },
      usersList: [],
      filteredUsersList: [],
      searchTerm: '',
      errorMessage: '',
      successMessage: '',
    };
  },
  computed: {
    ...mapGetters('client', ['users', 'error', 'success']),
  },
  methods: {
    ...mapActions('client', ['createClient', 'fetchAndSetUsers']),
    formattedError(error, message) {
      this.errorMessage = error || message;
      setTimeout(() => {
        this.errorMessage = '';
      }, 2000);
    },
    formattedSuccess(success, message) {
      this.successMessage = success || message;
      setTimeout(() => {
        this.successMessage = '';
      }, 2000);
    },
    async fetchData() {
      try {
        await this.fetchAndSetUsers();
        this.usersList = this.users
          .filter(user => user.isActive)
          .map(user => ({
            _id: user._id,
            fullName: `${user.name} ${user.lastName} (${user.dni})`,
          }));
        this.filteredUsersList = this.usersList;
      } catch (error) {
        this.formattedError(this.error, "Error al cargar los datos");
      }
    },

    filterUsers(search) {
      const searchTerm = search.toLowerCase();
      this.filteredUsersList = this.usersList.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm)
      );
    },

    async submitForm() {
      this.v$.$touch();

      if (this.v$.$invalid) return;

      const clientData = {
        user: this.state.user,
      };

      try {
        await this.createClient(clientData);
        this.formattedSuccess(this.success, "Cliente creado con éxito");
        this.$router.push({ name: 'ClientList' });
      } catch (error) {
        this.formattedError(this.error, "Error al crear el cliente");
      }
    },

    cancel() {
      this.$router.push({ name: 'ClientList' });
    },
  },
  validations() {
    return createClientValidations();
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
